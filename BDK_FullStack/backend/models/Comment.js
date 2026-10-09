import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please provide reply text'],
    trim: true,
    maxlength: [2000, 'Reply cannot be more than 2000 characters']
  },
  replyToUser: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide comment text'],
    trim: true,
    maxlength: [5000, 'Comment cannot be more than 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    default: null // If null, it's a general discussion comment
  },
  isOnGeneralWall: {
    type: Boolean,
    default: false // True if posted on general fan discussion wall
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [replySchema],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedReason: {
    type: String,
    default: null
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

export default mongoose.model('Comment', commentSchema);
