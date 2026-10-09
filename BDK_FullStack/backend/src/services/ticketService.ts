import { TicketTier, MatchTicketBooking } from '../models/types.js';
import { mockTicketTiers, mockMatches } from './mockData.js';

let ticketTiers: TicketTier[] = [...mockTicketTiers];
let bookings: MatchTicketBooking[] = [];

export const ticketService = {
  getTiers: () => ticketTiers,

  getTierById: (id: string) => ticketTiers.find((t) => t.id === id),

  getAllBookings: () => bookings,

  getBookingById: (id: string) => bookings.find((b) => b.id === id),

  bookTicket: (bookingData: {
    matchId: string;
    tierId: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: 'Telebirr' | 'CBE Birr' | 'BOA' | 'Card';
  }) => {
    const tier = ticketTiers.find((t) => t.id === bookingData.tierId);
    if (!tier) throw new Error('Invalid ticket tier');

    const match = mockMatches.find((m) => m.id === bookingData.matchId);
    const matchTitle = match ? `${match.homeTeam} vs ${match.awayTeam}` : 'BDK Home Match';

    const booking: MatchTicketBooking = {
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      matchId: bookingData.matchId,
      matchTitle,
      tierId: tier.id,
      tierName: tier.name,
      quantity: bookingData.quantity,
      totalPrice: tier.price * bookingData.quantity,
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      customerEmail: bookingData.customerEmail,
      paymentMethod: bookingData.paymentMethod,
      status: 'CONFIRMED',
      qrCodeToken: `BDK-QR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      bookedAt: new Date().toISOString(),
    };

    tier.availableSeats = Math.max(0, tier.availableSeats - bookingData.quantity);
    bookings.unshift(booking);
    return booking;
  },
};
