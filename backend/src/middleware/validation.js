import { body, param, query, validationResult } from 'express-validator';
import { apiError } from '../utils/helpers.js';

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  return next(apiError('Validation failed', 400, 'VALIDATION_ERROR', result.array()));
};

export const idParam = [param('id').isUUID().withMessage('Invalid id')];
export const slugParam = [param('slug').isString().trim().notEmpty().withMessage('Slug is required')];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const applicationCreateValidation = [
  body('programInterest').trim().notEmpty().withMessage('Program interest is required'),
  body('specificProgram').optional({ values: 'falsy' }).isString().trim(),
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional({ values: 'falsy' }).isString().trim(),
  body('dateOfBirth').optional({ values: 'falsy' }).isISO8601().withMessage('Valid date of birth is required'),
  body('institution').trim().notEmpty().withMessage('Institution is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('language').optional({ values: 'falsy' }).isString().trim(),
  body('motivationStatement')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Motivation statement must be 50-2000 characters'),
  body('heardFrom').optional({ values: 'falsy' }).isString().trim(),
];

export const inquiryCreateValidation = [
  body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
  body('organizationType').trim().notEmpty().withMessage('Organization type is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('website').optional({ values: 'falsy' }).isURL().withMessage('Website must be a valid URL'),
  body('contactName').trim().notEmpty().withMessage('Contact name is required'),
  body('contactTitle').trim().notEmpty().withMessage('Contact title is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required'),
  body('contactPhone').optional({ values: 'falsy' }).isString().trim(),
  body('interestTypes').isArray({ min: 1 }).withMessage('At least one interest type is required'),
  body('cohortSize').optional({ values: 'falsy' }).isString().trim(),
  body('timeline').optional({ values: 'falsy' }).isString().trim(),
  body('additionalInfo').optional({ values: 'falsy' }).isString().trim(),
];

export const adminCreateValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('role').isIn(['super_admin', 'admin', 'viewer']).withMessage('Invalid role'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('sendInvite').optional().isBoolean().withMessage('sendInvite must be boolean'),
];

export const adminUpdateValidation = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('fullName').optional().trim().isLength({ min: 2 }),
  body('role').optional().isIn(['super_admin', 'admin', 'viewer']).withMessage('Invalid role'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

export const applicationUpdateValidation = [
  body('status').optional().isIn(['new', 'reviewed', 'accepted', 'rejected']),
  body('internalNotes').optional({ values: 'falsy' }).isString(),
];

export const inquiryUpdateValidation = [
  body('status').optional().isIn(['new', 'contacted', 'partnered', 'partnership', 'closed']),
  body('internalNotes').optional({ values: 'falsy' }).isString(),
];

export const programCreateValidation = [
  body('slug').trim().notEmpty(),
  body('category').isIn(['student', 'professional', 'institutional']),
  body('title').trim().notEmpty(),
  body('status').optional().isIn(['accepting', 'coming_soon', 'coming-soon', 'full', 'closed']),
];

export const programUpdateValidation = [
  body('slug').optional().trim().notEmpty(),
  body('category').optional().isIn(['student', 'professional', 'institutional']),
  body('title').optional().trim().notEmpty(),
  body('status').optional().isIn(['accepting', 'coming_soon', 'coming-soon', 'full', 'closed']),
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];
