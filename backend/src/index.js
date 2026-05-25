import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import inquiryRoutes from './routes/inquiries.js';
import programRoutes from './routes/programs.js';
import adminRoutes from './routes/admins.js';
import statsRoutes from './routes/stats.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'cardinal-immersions-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use(authRoutes);
app.use(applicationRoutes);
app.use(inquiryRoutes);
app.use(programRoutes);
app.use(adminRoutes);
app.use(statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
