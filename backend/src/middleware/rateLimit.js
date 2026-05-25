import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 900000);
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100);

export const publicLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs,
  max: Math.max(20, Math.floor(maxRequests / 2)),
  standardHeaders: true,
  legacyHeaders: false,
});
