import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseFormatter.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server';
  return sendError(res, message, status, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
