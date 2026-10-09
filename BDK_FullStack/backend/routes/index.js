import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, authorize } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';
import * as orderController from '../controllers/orderController.js';
import * as newsController from '../controllers/newsController.js';
import * as liveScoreController from '../controllers/liveScoreController.js';
import * as commentController from '../controllers/commentController.js';
import * as playerController from '../controllers/playerController.js';
import * as ticketController from '../controllers/ticketController.js';
import * as userController from '../controllers/userController.js';
import * as heroEventController from '../controllers/heroEventController.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `bdk-${Date.now()}-${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// ==================== UNIVERSAL FILE UPLOAD ROUTE ====================
router.post('/upload', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      message: 'File uploaded successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== AUTH ROUTES ====================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.post('/auth/logout', protect, authController.logout);

// ==================== USER & PROFILE ROUTES ====================
router.get('/users/profile', protect, authController.getMe);
router.put('/users/profile', protect, userController.updateProfile);
router.put('/users/password', protect, userController.updatePassword);
router.get('/admin/users', protect, authorize('admin'), userController.getUsers);
router.put('/admin/users/:id/role', protect, authorize('admin'), userController.updateUserRole);
router.put('/admin/users/:id/ban', protect, authorize('admin'), userController.toggleBanUser);

// ==================== PLAYER ROUTES (SQUAD) ====================
router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getPlayer);
router.post('/players', protect, authorize('admin'), playerController.createPlayer);
router.put('/players/:id', protect, authorize('admin'), playerController.updatePlayer);
router.delete('/players/:id', protect, authorize('admin'), playerController.deletePlayer);

// ==================== TICKET ROUTES ====================
router.get('/tickets/tiers', ticketController.getTicketTiers);
router.post('/tickets/book', protect, ticketController.bookTicket);
router.get('/tickets/my-bookings', protect, ticketController.getMyBookings);
router.get('/tickets/admin/bookings', protect, authorize('admin'), ticketController.getAllBookings);

// ==================== PRODUCT ROUTES (SHOP) ====================
router.get('/products', productController.getProducts);
router.get('/products/categories', productController.getCategories);
router.get('/products/:id', productController.getProduct);
router.post('/products', protect, authorize('admin'), productController.createProduct);
router.put('/products/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/products/:id', protect, authorize('admin'), productController.deleteProduct);
router.delete('/products/:productId/images/:imageId', protect, authorize('admin'), productController.deleteProductImage);

// ==================== ORDER ROUTES ====================
router.post('/orders', protect, orderController.createOrder);
router.get('/orders', protect, authorize('admin'), orderController.getAllOrders);
router.get('/orders/my-orders', protect, orderController.getMyOrders);
router.get('/orders/stats', protect, authorize('admin'), orderController.getOrderStats);
router.get('/orders/:id', protect, orderController.getOrder);
router.put('/orders/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);
router.put('/orders/:id/cancel', protect, orderController.cancelOrder);

// ==================== NEWS ROUTES ====================
router.get('/news', newsController.getNews);
router.get('/news/stats', protect, authorize('admin'), newsController.getNewsStats);
router.get('/news/:id', newsController.getNewsArticle);
router.post('/news', protect, authorize('admin'), newsController.createNews);
router.put('/news/:id', protect, authorize('admin'), newsController.updateNews);
router.delete('/news/:id', protect, authorize('admin'), newsController.deleteNews);
router.put('/news/:id/like', protect, newsController.toggleLike);
router.post('/news/:id/comments', protect, newsController.addComment);
router.delete('/news/:newsId/comments/:commentId', protect, newsController.deleteComment);

// ==================== LIVE SCORE / MATCH ROUTES ====================
router.get('/matches', liveScoreController.getMatches);
router.get('/matches/upcoming', liveScoreController.getUpcomingMatches);
router.get('/matches/recent-results', liveScoreController.getRecentResults);
router.get('/matches/:id', liveScoreController.getMatch);
router.post('/matches', protect, authorize('admin'), liveScoreController.createMatch);
router.put('/matches/:id/score', protect, authorize('admin'), liveScoreController.updateMatchScore);
router.put('/matches/:id', protect, authorize('admin'), liveScoreController.updateMatch);
router.delete('/matches/:id', protect, authorize('admin'), liveScoreController.deleteMatch);

// ==================== COMMENT/DISCUSSION ROUTES ====================
router.get('/discussions', commentController.getFanDiscussions);
router.get('/discussions/news/:newsId', commentController.getNewsComments);
router.post('/discussions', protect, commentController.postOnFanWall);
router.post('/discussions/news/:newsId', protect, commentController.postCommentOnNews);
router.put('/discussions/:commentId', protect, commentController.updateComment);
router.delete('/discussions/:commentId', protect, commentController.deleteComment);
router.put('/discussions/:commentId/like', protect, commentController.toggleCommentLike);

// TikTok-style nested comment replies
router.post('/discussions/:commentId/reply', protect, commentController.addReplyToComment);
router.put('/discussions/:commentId/replies/:replyId/like', protect, commentController.toggleReplyLike);
router.delete('/discussions/:commentId/replies/:replyId', protect, commentController.deleteReply);

// Admin comment moderation
router.get('/admin/comments', protect, authorize('admin'), commentController.getAllComments);
router.put('/admin/comments/:commentId/moderate', protect, authorize('admin'), commentController.moderateComment);
router.get('/admin/comments/stats', protect, authorize('admin'), commentController.getCommentStats);

// ==================== HERO EVENT CAROUSEL ROUTES ====================
router.get('/hero-events', heroEventController.getHeroEvents);
router.get('/admin/hero-events', protect, authorize('admin'), heroEventController.getAllHeroEventsAdmin);
router.post('/admin/hero-events', protect, authorize('admin'), heroEventController.createHeroEvent);
router.put('/admin/hero-events/:id', protect, authorize('admin'), heroEventController.updateHeroEvent);
router.put('/admin/hero-events/:id/toggle', protect, authorize('admin'), heroEventController.toggleHeroEventActive);
router.delete('/admin/hero-events/:id', protect, authorize('admin'), heroEventController.deleteHeroEvent);

export default router;
