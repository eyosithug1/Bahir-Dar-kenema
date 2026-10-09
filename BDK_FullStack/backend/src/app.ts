import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Root welcome route
  app.get('/', (_req, res) => {
    res.json({
      name: config.clubName,
      nickname: config.clubNickname,
      stadium: config.stadium,
      version: '1.0.0',
      apiDocs: '/api/v1',
      endpoints: [
        '/api/v1/health',
        '/api/v1/matches',
        '/api/v1/matches/upcoming',
        '/api/v1/matches/results',
        '/api/v1/matches/standings',
        '/api/v1/players',
        '/api/v1/news',
        '/api/v1/tickets/tiers',
        '/api/v1/tickets/bookings',
        '/api/v1/products',
        '/api/v1/auth/login',
        '/api/v1/auth/register',
      ],
    });
  });

  // Mount API
  app.use('/api/v1', apiRouter);

  // Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
