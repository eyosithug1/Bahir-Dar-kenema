import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseFormatter.js';
import { mockUsers } from '../services/mockData.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access denied. No authorization token provided.', 401);
  }

  // Simulated token verification for development
  if (token.startsWith('bdk_token_')) {
    const userId = token.replace('bdk_token_', '');
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Fallback demo user
  req.user = mockUsers[0];
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Access denied. Administrator privileges required.', 403);
  }
  next();
};
