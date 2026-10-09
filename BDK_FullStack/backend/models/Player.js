import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide player name'],
    trim: true
  },
  number: {
    type: Number,
    required: [true, 'Please provide shirt number'],
    unique: true
  },
  position: {
    type: String,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
    required: [true, 'Please provide position']
  },
  role: {
    type: String,
    enum: ['GK', 'DF', 'MF', 'FW'],
    required: [true, 'Please provide position abbreviation']
  },
  country: {
    type: String,
    required: [true, 'Please provide nationality'],
    default: 'Ethiopia'
  },
  age: {
    type: Number,
    required: [true, 'Please provide age']
  },
  height: {
    type: String,
    default: "1.82m"
  },
  weight: {
    type: String,
    default: "76kg"
  },
  photo: {
    type: String,
    default: '/BDK_asset/club team squad/images (43).jpeg'
  },
  bio: {
    type: String,
    default: ''
  },
  stats: {
    appearances: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 }
  },
  achievements: [String],
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
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

export default mongoose.model('Player', playerSchema);
