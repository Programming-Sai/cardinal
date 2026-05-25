import { apiError, apiSuccess } from '../utils/helpers.js';
import {
  createProgram,
  deleteProgram,
  getProgramById,
  getProgramBySlug,
  listPrograms,
  updateProgram,
} from '../models/Program.js';
import { logAdminAction } from '../models/AuditLog.js';
import { normalizeProgramStatus } from '../utils/helpers.js';

export const listPublicPrograms = async (req, res, next) => {
  try {
    const programs = await listPrograms({
      status: req.query.status ? normalizeProgramStatus(req.query.status) : undefined,
      category: req.query.category,
    });
    apiSuccess(res, programs);
  } catch (error) {
    next(error);
  }
};

export const getPublicProgram = async (req, res, next) => {
  try {
    const program = await getProgramBySlug(req.params.slug);
    if (!program) {
      return next(apiError('Program not found', 404, 'NOT_FOUND'));
    }
    apiSuccess(res, program);
  } catch (error) {
    next(error);
  }
};

export const listAdminPrograms = async (req, res, next) => {
  try {
    const programs = await listPrograms({
      status: req.query.status ? normalizeProgramStatus(req.query.status) : undefined,
      category: req.query.category,
    });
    apiSuccess(res, programs);
  } catch (error) {
    next(error);
  }
};

export const createAdminProgram = async (req, res, next) => {
  try {
    const program = await createProgram({
      ...req.body,
      status: normalizeProgramStatus(req.body.status),
    });
    await logAdminAction({
      adminId: req.admin.id,
      action: 'program.create',
      targetType: 'program',
      targetId: program.id,
      details: { slug: program.slug },
    });
    apiSuccess(res, program, 201);
  } catch (error) {
    next(error);
  }
};

export const updateAdminProgram = async (req, res, next) => {
  try {
    const existing = await getProgramById(req.params.id);
    if (!existing) {
      return next(apiError('Program not found', 404, 'NOT_FOUND'));
    }

    const program = await updateProgram(req.params.id, {
      ...req.body,
      status: req.body.status ? normalizeProgramStatus(req.body.status) : undefined,
    });
    await logAdminAction({
      adminId: req.admin.id,
      action: 'program.update',
      targetType: 'program',
      targetId: req.params.id,
      details: req.body,
    });

    apiSuccess(res, program);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminProgram = async (req, res, next) => {
  try {
    const existing = await getProgramById(req.params.id);
    if (!existing) {
      return next(apiError('Program not found', 404, 'NOT_FOUND'));
    }

    await deleteProgram(req.params.id);
    await logAdminAction({
      adminId: req.admin.id,
      action: 'program.delete',
      targetType: 'program',
      targetId: req.params.id,
    });

    apiSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
};
