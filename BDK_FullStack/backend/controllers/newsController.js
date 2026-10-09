import News from '../models/News.js';

// Get all published news
export const getNews = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { published: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const news = await News.find(filter)
      .populate('author', 'firstName lastName avatar')
      .populate('comments.author', 'firstName lastName avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single news article
export const getNewsArticle = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'firstName lastName avatar')
      .populate('comments.author', 'firstName lastName avatar');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment view count
    news.viewCount += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create news (Admin only)
export const createNews = async (req, res) => {
  try {
    const { title, description, content, category, tags } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and content'
      });
    }

    let featuredImage = null;
    let images = [];

    // Support direct image from body
    if (req.body.featuredImage) {
      if (typeof req.body.featuredImage === 'string') {
        featuredImage = { url: req.body.featuredImage, public_id: 'custom' };
      } else {
        featuredImage = req.body.featuredImage;
      }
    }

    if (req.files) {
      if (req.files.featuredImage) {
        featuredImage = {
          url: req.files.featuredImage[0].path,
          public_id: req.files.featuredImage[0].filename
        };
      }

      if (req.files.images) {
        images = req.files.images.map(file => ({
          url: file.path,
          public_id: file.filename
        }));
      }
    }

    const news = await News.create({
      title,
      description,
      content,
      category: category || 'News',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      featuredImage,
      images,
      author: req.user.id,
      published: true
    });

    const populatedNews = await News.findById(news._id)
      .populate('author', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: populatedNews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update news (Admin only)
export const updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const { title, description, content, category, tags, published } = req.body;

    if (title) news.title = title;
    if (description) news.description = description;
    if (content) news.content = content;
    if (category) news.category = category;
    if (tags) news.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    if (published !== undefined) news.published = published;

    // Handle new featured image from body
    if (req.body.featuredImage) {
      if (typeof req.body.featuredImage === 'string') {
        news.featuredImage = { url: req.body.featuredImage, public_id: 'custom' };
      } else {
        news.featuredImage = req.body.featuredImage;
      }
    }

    // Handle new featured image from files
    if (req.files && req.files.featuredImage) {
      news.featuredImage = {
        url: req.files.featuredImage[0].path,
        public_id: req.files.featuredImage[0].filename
      };
    }

    // Handle additional images
    if (req.files && req.files.images) {
      const newImages = req.files.images.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      news.images = [...news.images, ...newImages];
    }

    news.updatedAt = Date.now();
    await news.save();

    await news.populate('author', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete news (Admin only)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add comment to news (Client)
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment content'
      });
    }

    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const comment = {
      author: req.user.id,
      content,
      createdAt: Date.now()
    };

    news.comments.push(comment);
    await news.save();

    await news.populate('comments.author', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: news.comments[news.comments.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete comment (Admin or comment author)
export const deleteComment = async (req, res) => {
  try {
    const { newsId, commentId } = req.params;

    let news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const comment = news.comments.id(commentId);

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

    news.comments.id(commentId).deleteOne();
    await news.save();

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

// Like/Unlike article
export const toggleLike = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const likeIndex = news.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      news.likes.splice(likeIndex, 1);
    } else {
      news.likes.push(req.user.id);
    }

    await news.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Like removed' : 'Article liked',
      likes: news.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get news stats (Admin)
export const getNewsStats = async (req, res) => {
  try {
    const totalArticles = await News.countDocuments();
    const publishedArticles = await News.countDocuments({ published: true });
    const totalComments = await News.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$comments' } } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        totalComments: totalComments.length > 0 ? totalComments[0].total : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
