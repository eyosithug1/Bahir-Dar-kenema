import { Request, Response } from 'express';
import { ticketService } from '../services/ticketService.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const ticketController = {
  getTiers: (_req: Request, res: Response) => {
    try {
      const tiers = ticketService.getTiers();
      return sendSuccess(res, tiers, 'Ticket tiers retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getAllBookings: (_req: Request, res: Response) => {
    try {
      const bookings = ticketService.getAllBookings();
      return sendSuccess(res, bookings, 'Bookings retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getBookingById: (req: Request, res: Response) => {
    try {
      const booking = ticketService.getBookingById(req.params.id);
      if (!booking) return sendError(res, 'Booking not found', 404);
      return sendSuccess(res, booking, 'Booking retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  bookTicket: (req: Request, res: Response) => {
    try {
      const { matchId, tierId, quantity, customerName, customerPhone, customerEmail, paymentMethod } = req.body;
      if (!matchId || !tierId || !quantity || !customerName || !customerPhone) {
        return sendError(res, 'Missing required booking details', 400);
      }
      const booking = ticketService.bookTicket({
        matchId,
        tierId,
        quantity: parseInt(quantity, 10),
        customerName,
        customerPhone,
        customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@bdkfan.et`,
        paymentMethod: paymentMethod || 'Telebirr',
      });
      return sendSuccess(res, booking, 'Ticket booked successfully! E-Ticket generated.', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },
};
