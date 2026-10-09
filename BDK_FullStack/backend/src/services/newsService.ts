import { NewsArticle } from '../models/types.js';
import { mockNews } from './mockData.js';

let news: NewsArticle[] = [...mockNews];

export const newsService = {
  getAllNews: (category?: string) => {
    if (category) {
      return news.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    }
    return news;
  },

  getArticleById: (id: string) => news.find((n) => n.id === id),

  createArticle: (data: Omit<NewsArticle, 'id' | 'publishedAt'>) => {
    const newArticle: NewsArticle = {
      ...data,
      id: `news-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    news.unshift(newArticle);
    return newArticle;
  },

  updateArticle: (id: string, updates: Partial<NewsArticle>) => {
    const index = news.findIndex((n) => n.id === id);
    if (index === -1) return null;
    news[index] = { ...news[index], ...updates };
    return news[index];
  },

  deleteArticle: (id: string) => {
    const index = news.findIndex((n) => n.id === id);
    if (index === -1) return false;
    news.splice(index, 1);
    return true;
  },
};
