export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const apiSuccess = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const apiError = (message, status = 500, code = 'SERVER_ERROR', details = null) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.details = details;
  return error;
};

export const normalizeEmail = (value = '') => value.trim().toLowerCase();

export const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const buildPagination = (query = {}) => {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(parsePositiveInt(query.limit, 20), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const toCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = Array.isArray(value) || typeof value === 'object'
    ? JSON.stringify(value)
    : String(value);
  const escaped = stringValue.replaceAll('"', '""');
  return `"${escaped}"`;
};

export const csvFromRows = (headers, rows) => {
  const head = headers.map((header) => toCsvValue(header)).join(',');
  const body = rows.map((row) => headers.map((header) => toCsvValue(row[header])).join(','));
  return [head, ...body].join('\n');
};

export const normalizeProgramStatus = (status) => {
  if (status === 'coming-soon') return 'coming_soon';
  return status;
};

export const normalizeInquiryStatus = (status) => {
  if (status === 'partnership') return 'partnered';
  return status;
};
