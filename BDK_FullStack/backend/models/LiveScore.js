import mongoose from 'mongoose';

const liveScoreSchema = new mongoose.Schema({
  matchTitle: {
    type: String,
    required: [true, 'Please provide match title'],
    trim: true
  },
  homeTeam: {
    type: String,
    required: [true, 'Please provide home team name']
  },
  awayTeam: {
    type: String,
    required: [true, 'Please provide away team name']
  },
  homeScore: {
    type: Number,
    default: 0
  },
  awayScore: {
    type: Number,
    default: 0
  },
  matchDate: {
    type: Date,
    required: [true, 'Please provide match date']
  },
  matchTime: {
    type: String,
    default: ''
  },
  venue: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'finished', 'postponed'],
    default: 'upcoming'
  },
  competition: {
    type: String,
    default: 'Ethiopian Premier League'
  },
  lineups: {
    homeTeamLineup: [String],
    awayTeamLineup: [String]
  },
  highlights: {
    type: String,
    default: null // Video URL
  },
  statistics: {
    possession: {
      home: Number,
      away: Number
    },
    shots: {
      home: Number,
      away: Number
    },
    fouls: {
      home: Number,
      away: Number
    }
  },
  updatedBy: {
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

export default mongoose.model('LiveScore', liveScoreSchema);
