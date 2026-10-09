import TicketBooking from '../models/TicketBooking.js';
import LiveScore from '../models/LiveScore.js';

// Get ticket pricing tiers
export const getTicketTiers = async (req, res) => {
  const tiers = [
    { id: 'vip', name: 'VIP Tribune', price: 500, perks: ['Reserved center seat', 'Complimentary drink', 'Lounge access'], available: 85 },
    { id: 'regular', name: 'Regular Stand', price: 150, perks: ['Covered seating', 'Great pitch view'], available: 320 },
    { id: 'student', name: 'Student / Youth', price: 80, perks: ['Standing & East terrace', 'Student ID required'], available: 450 }
  ];
  res.status(200).json({ success: true, data: tiers });
};

// Book tickets for a match
export const bookTicket = async (req, res, next) => {
  try {
    const { matchId, tierName, quantity, paymentMethod } = req.body;
    
    // Check match exists
    const match = await LiveScore.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const priceMap = { VIP: 500, Regular: 150, Student: 80, Standard: 150 };
    const unitPrice = priceMap[tierName] || 150;
    const qty = Number(quantity) || 1;
    const totalAmount = unitPrice * qty;

    const booking = await TicketBooking.create({
      match: matchId,
      customer: req.user._id,
      customerName: `${req.user.firstName} ${req.user.lastName}`,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '0900000000',
      tierName: tierName || 'Regular',
      quantity: qty,
      unitPrice,
      totalAmount,
      paymentMethod: paymentMethod || 'telebirr'
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Ticket booked successfully! Keep your reference code ready.'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's ticket bookings
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await TicketBooking.find({ customer: req.user._id })
      .populate('match')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all ticket bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await TicketBooking.find()
      .populate('match')
      .populate('customer', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};
