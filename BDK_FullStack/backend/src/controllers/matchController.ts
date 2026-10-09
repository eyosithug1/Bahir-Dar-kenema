import { Request, Response } from 'express';
import { matchService } from '../services/matchService.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const matchController = {
  getMatches: (_req: Request, res: Response) => {
    try {
      const matches = matchService.getAllMatches();
      return sendSuccess(res, matches, 'Matches retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getMatchById: (req: Request, res: Response) => {
    try {
      const match = matchService.getMatchById(req.params.id);
      if (!match) return sendError(res, 'Match not found', 404);
      return sendSuccess(res, match, 'Match retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getUpcoming: (_req: Request, res: Response) => {
    try {
      const matches = matchService.getUpcomingMatches();
      return sendSuccess(res, matches, 'Upcoming fixtures retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getResults: (_req: Request, res: Response) => {
    try {
      const matches = matchService.getRecentResults();
      return sendSuccess(res, matches, 'Recent match results retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getStandings: (_req: Request, res: Response) => {
    try {
      const standings = matchService.getStandings();
      return sendSuccess(res, standings, 'League standings retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  createMatch: (req: Request, res: Response) => {
    try {
      const newMatch = matchService.createMatch(req.body);
      return sendSuccess(res, newMatch, 'Match created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  updateMatch: (req: Request, res: Response) => {
    try {
      const updated = matchService.updateMatch(req.params.id, req.body);
      if (!updated) return sendError(res, 'Match not found', 404);
      return sendSuccess(res, updated, 'Match updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },
};
