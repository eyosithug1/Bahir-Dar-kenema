import { Request, Response } from 'express';
import { playerService } from '../services/playerService.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { Position } from '../models/types.js';

export const playerController = {
  getPlayers: (req: Request, res: Response) => {
    try {
      const position = req.query.position as Position | undefined;
      const players = playerService.getAllPlayers(position);
      return sendSuccess(res, players, 'Squad list retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getPlayerById: (req: Request, res: Response) => {
    try {
      const player = playerService.getPlayerById(req.params.id);
      if (!player) return sendError(res, 'Player not found', 404);
      return sendSuccess(res, player, 'Player profile retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  createPlayer: (req: Request, res: Response) => {
    try {
      const player = playerService.createPlayer(req.body);
      return sendSuccess(res, player, 'Player added successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  updatePlayer: (req: Request, res: Response) => {
    try {
      const player = playerService.updatePlayer(req.params.id, req.body);
      if (!player) return sendError(res, 'Player not found', 404);
      return sendSuccess(res, player, 'Player updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  deletePlayer: (req: Request, res: Response) => {
    try {
      const deleted = playerService.deletePlayer(req.params.id);
      if (!deleted) return sendError(res, 'Player not found', 404);
      return sendSuccess(res, null, 'Player deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
