import { Request, Response } from 'express';
import { newsService } from '../services/newsService.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const newsController = {
  getAllNews: (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const news = newsService.getAllNews(category);
      return sendSuccess(res, news, 'News articles retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getArticleById: (req: Request, res: Response) => {
    try {
      const article = newsService.getArticleById(req.params.id);
      if (!article) return sendError(res, 'Article not found', 404);
      return sendSuccess(res, article, 'Article details retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  createArticle: (req: Request, res: Response) => {
    try {
      const article = newsService.createArticle(req.body);
      return sendSuccess(res, article, 'Article published successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  updateArticle: (req: Request, res: Response) => {
    try {
      const article = newsService.updateArticle(req.params.id, req.body);
      if (!article) return sendError(res, 'Article not found', 404);
      return sendSuccess(res, article, 'Article updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  deleteArticle: (req: Request, res: Response) => {
    try {
      const deleted = newsService.deleteArticle(req.params.id);
      if (!deleted) return sendError(res, 'Article not found', 404);
      return sendSuccess(res, null, 'Article deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
