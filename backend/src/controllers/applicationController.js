import { withTransaction } from '../config/database.js';
import { apiError, apiSuccess, buildPagination } from '../utils/helpers.js';
import { nextReferenceNumber } from '../models/ReferenceCounter.js';
import {
  createApplication,
  deleteApplication,
  findApplicationDuplicate,
  getApplicationById,
  listApplications,
  mapApplicationRow,
  updateApplication,
} from '../models/Application.js';
import { logAdminAction } from '../models/AuditLog.js';
import { sendEmail } from '../config/email.js';
import { templates } from '../utils/emailTemplates.js';
import { getProgramBySlug } from '../models/Program.js';

export const createPublicApplication = async (req, res, next) => {
  const payload = {
    programInterest: req.body.programInterest,
    specificProgram: req.body.specificProgram || null,
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone || null,
    dateOfBirth: req.body.dateOfBirth || null,
    institution: req.body.institution,
    country: req.body.country,
    language: req.body.language || null,
    motivationStatement: req.body.motivationStatement,
    heardFrom: req.body.heardFrom || null,
    cvUrl: req.body.cvUrl || null,
  };

  try {
    const result = await withTransaction(async (client) => {
      const duplicate = await findApplicationDuplicate(payload, client);
      if (duplicate) {
        throw apiError('A similar application already exists.', 409, 'CONFLICT');
      }

      const referenceNumber = await nextReferenceNumber(client, 'applications', 'APP');
      const row = await createApplication(payload, referenceNumber, client);
      const program = payload.specificProgram ? await getProgramBySlug(payload.specificProgram, client) : null;

      return {
        application: await mapApplicationRow(row, client),
        referenceNumber,
        program,
      };
    });

    sendEmail({
      to: payload.email,
      subject: `Cardinal Immersions application received - ${result.referenceNumber}`,
      html: templates.applicationReceived({
        name: payload.fullName,
        referenceNumber: result.referenceNumber,
      }),
    }).catch((error) => {
      console.error('Application confirmation email failed:', error.message);
    });

    apiSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const listAdminApplicationsHandler = async (req, res, next) => {
  try {
    const pagination = buildPagination(req.query);
    const result = await listApplications(
      {
        status: req.query.status,
        programInterest: req.query.programInterest || req.query.programType,
        search: req.query.search,
        page: pagination.page,
        limit: pagination.limit,
      }
    );

    apiSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getAdminApplication = async (req, res, next) => {
  try {
    const row = await getApplicationById(req.params.id);
    if (!row) {
      return next(apiError('Application not found', 404, 'NOT_FOUND'));
    }
    const application = await mapApplicationRow(row);
    apiSuccess(res, application);
  } catch (error) {
    next(error);
  }
};

export const updateAdminApplication = async (req, res, next) => {
  try {
    const existing = await getApplicationById(req.params.id);
    if (!existing) {
      return next(apiError('Application not found', 404, 'NOT_FOUND'));
    }

    const updates = {
      status: req.body.status,
      internalNotes: req.body.internalNotes,
      reviewedBy: req.admin.id,
      reviewedAt: new Date().toISOString(),
    };

    const updated = await updateApplication(req.params.id, updates);

    await logAdminAction(
      {
        adminId: req.admin.id,
        action: 'application.update',
        targetType: 'application',
        targetId: req.params.id,
        details: { status: req.body.status, internalNotes: Boolean(req.body.internalNotes) },
      }
    );

    if (updated && ['accepted', 'rejected'].includes(updated.status)) {
      sendEmail({
        to: updated.email,
        subject: `Your Cardinal Immersions application has been ${updated.status}`,
        html: templates.applicationStatusUpdate({
          name: updated.full_name,
          status: updated.status,
        }),
      }).catch((error) => {
        console.error('Application status email failed:', error.message);
      });
    }

    apiSuccess(res, await mapApplicationRow(updated));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminApplication = async (req, res, next) => {
  try {
    const existing = await getApplicationById(req.params.id);
    if (!existing) {
      return next(apiError('Application not found', 404, 'NOT_FOUND'));
    }

    await deleteApplication(req.params.id);
    await logAdminAction({
      adminId: req.admin.id,
      action: 'application.delete',
      targetType: 'application',
      targetId: req.params.id,
    });

    apiSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
};

export const exportApplicationsCsv = async (req, res, next) => {
  try {
    const { items } = await listApplications({ limit: 1000, page: 1 });
    const headers = [
      'referenceNumber',
      'submittedAt',
      'status',
      'programInterest',
      'specificProgram',
      'fullName',
      'email',
      'phone',
      'institution',
      'country',
      'motivationStatement',
    ];
    const csvRows = items.map((item) => {
      const row = {};
      for (const header of headers) {
        row[header] = item[header];
      }
      return row;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(
      [
        headers.join(','),
        ...csvRows.map((row) =>
          headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
        ),
      ].join('\n')
    );
  } catch (error) {
    next(error);
  }
};
