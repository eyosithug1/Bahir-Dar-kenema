import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const authController = {
  login: (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email) return sendError(res, 'Email is required', 400);
      const result = authService.login(email, password);
      return sendSuccess(res, result, 'Logged in successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  register: (req: Request, res: Response) => {
    try {
      const { name, email, phoneNumber } = req.body;
      if (!name || !email) return sendError(res, 'Name and email are required', 400);
      const result = authService.register(name, email, phoneNumber);
      return sendSuccess(res, result, 'Registration successful', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  me: (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) return sendError(res, 'Not authenticated', 401);
      return sendSuccess(res, req.user, 'Current user profile');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
