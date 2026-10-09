import mongoose from 'mongoose';

const heroEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event or match title'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  category: {
    type: String,
    default: 'Premier League',
    trim: true
  },
  image: {
    url: {
      type: String,
      required: [true, 'Please provide event card image']
    },
    public_id: {
      type: String,
      default: 'custom'
    }
  },
  date: {
    type: String,
    default: 'Sun, Oct 26 • 16:00 EAT'
  },
  venue: {
    type: String,
    default: "Bahir Dar Int'l Stadium"
  },
  ticketPrice: {
    type: String,
    default: 'From 50 ETB'
  },
  badgeColor: {
    type: String,
    enum: ['green', 'gold', 'blue', 'red', 'purple'],
    default: 'gold'
  },
  link: {
    type: String,
    default: '/matches'
  },
  isActive: {
    type: Boolean,
    default: true // Admin can choose which cards rotate in hero marquee
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('HeroEvent', heroEventSchema);
