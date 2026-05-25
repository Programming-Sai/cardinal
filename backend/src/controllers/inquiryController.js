import { withTransaction } from '../config/database.js';
import { apiError, apiSuccess, buildPagination } from '../utils/helpers.js';
import { nextReferenceNumber } from '../models/ReferenceCounter.js';
import {
  createInquiry,
  deleteInquiry,
  findInquiryDuplicate,
  getInquiryById,
  listInquiries,
  mapInquiryRow,
  updateInquiry,
} from '../models/Inquiry.js';
import { logAdminAction } from '../models/AuditLog.js';
import { sendEmail } from '../config/email.js';
import { templates } from '../utils/emailTemplates.js';
import { normalizeInquiryStatus } from '../utils/helpers.js';

export const createPublicInquiry = async (req, res, next) => {
  const payload = {
    organizationName: req.body.organizationName,
    organizationType: req.body.organizationType,
    country: req.body.country,
    website: req.body.website || null,
    contactName: req.body.contactName,
    contactTitle: req.body.contactTitle,
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone || null,
    interestTypes: req.body.interestTypes,
    cohortSize: req.body.cohortSize || null,
    timeline: req.body.timeline || null,
    additionalInfo: req.body.additionalInfo || null,
  };

  try {
    const result = await withTransaction(async (client) => {
      const duplicate = await findInquiryDuplicate(
        { contactEmail: payload.contactEmail, organizationName: payload.organizationName },
        client
      );
      if (duplicate) {
        throw apiError('A similar inquiry already exists.', 409, 'CONFLICT');
      }

      const referenceNumber = await nextReferenceNumber(client, 'inquiries', 'INQ');
      const row = await createInquiry(payload, referenceNumber, client);

      return {
        inquiry: mapInquiryRow(row),
        referenceNumber,
      };
    });

    sendEmail({
      to: payload.contactEmail,
      subject: `Cardinal Immersions inquiry received - ${result.referenceNumber}`,
      html: templates.inquiryReceived({
        organizationName: payload.organizationName,
        referenceNumber: result.referenceNumber,
      }),
    }).catch((error) => {
      console.error('Inquiry confirmation email failed:', error.message);
    });

    apiSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const listAdminInquiriesHandler = async (req, res, next) => {
  try {
    const pagination = buildPagination(req.query);
    const result = await listInquiries({
      status: req.query.status ? normalizeInquiryStatus(req.query.status) : undefined,
      organizationType: req.query.organizationType,
      search: req.query.search,
      page: pagination.page,
      limit: pagination.limit,
    });
    apiSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getAdminInquiry = async (req, res, next) => {
  try {
    const row = await getInquiryById(req.params.id);
    if (!row) {
      return next(apiError('Inquiry not found', 404, 'NOT_FOUND'));
    }
    apiSuccess(res, mapInquiryRow(row));
  } catch (error) {
    next(error);
  }
};

export const updateAdminInquiry = async (req, res, next) => {
  try {
    const existing = await getInquiryById(req.params.id);
    if (!existing) {
      return next(apiError('Inquiry not found', 404, 'NOT_FOUND'));
    }

    const updated = await updateInquiry(req.params.id, {
      status: req.body.status ? normalizeInquiryStatus(req.body.status) : undefined,
      internalNotes: req.body.internalNotes,
      reviewedBy: req.admin.id,
      reviewedAt: new Date().toISOString(),
    });

    await logAdminAction({
      adminId: req.admin.id,
      action: 'inquiry.update',
      targetType: 'inquiry',
      targetId: req.params.id,
      details: { status: req.body.status, internalNotes: Boolean(req.body.internalNotes) },
    });

    apiSuccess(res, mapInquiryRow(updated));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminInquiry = async (req, res, next) => {
  try {
    const existing = await getInquiryById(req.params.id);
    if (!existing) {
      return next(apiError('Inquiry not found', 404, 'NOT_FOUND'));
    }

    await deleteInquiry(req.params.id);
    await logAdminAction({
      adminId: req.admin.id,
      action: 'inquiry.delete',
      targetType: 'inquiry',
      targetId: req.params.id,
    });

    apiSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
};

export const exportInquiriesCsv = async (req, res, next) => {
  try {
    const { items } = await listInquiries({ limit: 1000, page: 1 });
    const headers = [
      'referenceNumber',
      'submittedAt',
      'status',
      'organizationName',
      'organizationType',
      'country',
      'contactName',
      'contactTitle',
      'contactEmail',
      'contactPhone',
      'interestTypes',
      'cohortSize',
      'timeline',
      'additionalInfo',
    ];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="inquiries.csv"');
    res.send(
      [
        headers.join(','),
        ...items.map((item) =>
          headers.map((header) => JSON.stringify(item[header] ?? '')).join(',')
        ),
      ].join('\n')
    );
  } catch (error) {
    next(error);
  }
};
