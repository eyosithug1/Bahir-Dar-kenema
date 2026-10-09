import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';

const router = Router();

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getArticleById);
router.post('/', newsController.createArticle);
router.put('/:id', newsController.updateArticle);
router.delete('/:id', newsController.deleteArticle);

export default router;
