export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  error.code = 'NOT_FOUND';
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  const code = error.code || (status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR');

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    error: error.message || 'Unexpected server error',
    code,
    details: error.details || undefined,
  });
};
