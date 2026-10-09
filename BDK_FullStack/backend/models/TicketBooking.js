import mongoose from 'mongoose';

const ticketBookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    default: () => `TKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveScore',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  tierName: {
    type: String,
    enum: ['VIP', 'Regular', 'Student', 'Standard'],
    default: 'Regular'
  },
  seatCategory: {
    type: String,
    default: 'Main Stand'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'used'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['telebirr', 'chapa', 'stripe', 'cash_at_gate'],
    default: 'telebirr'
  },
  qrCodeToken: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ticketBookingSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  try {
    const count = await mongoose.model('TicketBooking').countDocuments();
    this.bookingReference = `TKT-${Date.now().toString(36).toUpperCase()}-${count + 1}`;
    this.qrCodeToken = `BDK-VERIFY-${this.bookingReference}`;
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('TicketBooking', ticketBookingSchema);
