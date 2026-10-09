import Comment from '../models/Comment.js';
import News from '../models/News.js';

// Get all fan discussion comments (general wall)
export const getFanDiscussions = async (req, res) => {
  try {
    const comments = await Comment.find({ isOnGeneralWall: true, isDeleted: false })
      .populate('author', 'firstName lastName avatar')
      .populate('replies.author', 'firstName lastName avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get comments on specific news article
export const getNewsComments = async (req, res) => {
  try {
    const { newsId } = req.params;

    const comments = await Comment.find({ newsId, isDeleted: false })
      .populate('author', 'firstName lastName avatar')
      .populate('replies.author', 'firstName lastName avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Post comment on news article (Client)
export const postCommentOnNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text'
      });
    }

    // Check if news exists
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    const comment = await Comment.create({
      text,
      author: req.user.id,
      newsId,
      isOnGeneralWall: false
    });

    await comment.populate('author', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Post on general fan discussion wall (Client)
export const postOnFanWall = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text'
      });
    }

    const comment = await Comment.create({
      text,
      author: req.user.id,
      isOnGeneralWall: true
    });

    await comment.populate('author', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Posted to fan wall successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update own comment (Client can edit own, Admin can edit any)
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text'
      });
    }

    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.text = text;
    comment.updatedAt = Date.now();
    await comment.save();

    await comment.populate('author', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete comment (Author can delete own, Admin can delete any)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    comment.isDeleted = true;
    comment.deletedReason = reason || 'Deleted by user';
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Like/Unlike comment
export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;

    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Like removed' : 'Comment liked',
      likes: comment.likes.length,
      liked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add a reply to comment (TikTok-style threaded reply)
export const addReplyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, replyToUser } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reply text'
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or has been removed'
      });
    }

    const newReply = {
      author: req.user.id,
      text: text.trim(),
      replyToUser: replyToUser || '',
      likes: [],
      createdAt: new Date()
    };

    comment.replies.push(newReply);
    await comment.save();

    await comment.populate('author', 'firstName lastName avatar');
    await comment.populate('replies.author', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Like/Unlike a reply
export const toggleReplyLike = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    const likeIndex = reply.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      reply.likes.splice(likeIndex, 1);
    } else {
      reply.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Like removed' : 'Reply liked',
      likes: reply.likes.length,
      liked: likeIndex === -1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a reply (author or admin)
export const deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && reply.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reply'
      });
    }

    comment.replies.pull(replyId);
    await comment.save();

    await comment.populate('author', 'firstName lastName avatar');
    await comment.populate('replies.author', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get comment stats (Admin)
export const getCommentStats = async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments({ isDeleted: false });
    const generalWallComments = await Comment.countDocuments({ isOnGeneralWall: true, isDeleted: false });
    const newsComments = await Comment.countDocuments({ isOnGeneralWall: false, isDeleted: false });

    res.status(200).json({
      success: true,
      data: {
        totalComments,
        generalWallComments,
        newsComments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all comments including deleted (Admin only for moderation)
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'firstName lastName avatar email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin moderate comment - mark as deleted
export const moderateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.isDeleted = true;
    comment.deletedReason = reason || 'Removed by moderation';
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
