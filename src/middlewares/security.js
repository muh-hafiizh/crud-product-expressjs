// src/middlewares/security.js

import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss-clean';
import cors from 'cors';
import helmet from 'helmet';

export function applySecurity(app) {
  // 1) Helmet dengan konfigurasi khusus
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
  }));

  // 2) CORS
  const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || true,
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  app.use(cors(corsOptions));

  // 3) Rate limiter
  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: {
      status: 429,
      error: 'Terlalu banyak request, silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // 4) HPP - prevent parameter pollution
  app.use(hpp());

  // 5) XSS Clean
  app.use(xss());
}