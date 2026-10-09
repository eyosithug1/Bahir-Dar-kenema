import { Router } from 'express';
import { ticketController } from '../controllers/ticketController.js';

const router = Router();

router.get('/tiers', ticketController.getTiers);
router.get('/bookings', ticketController.getAllBookings);
router.get('/bookings/:id', ticketController.getBookingById);
router.post('/book', ticketController.bookTicket);

export default router;
