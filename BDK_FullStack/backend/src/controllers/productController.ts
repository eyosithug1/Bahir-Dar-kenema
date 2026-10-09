import { Request, Response } from 'express';
import { storeService } from '../services/storeService.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const productController = {
  getProducts: (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const products = storeService.getAllProducts(category);
      return sendSuccess(res, products, 'Products retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getProductById: (req: Request, res: Response) => {
    try {
      const product = storeService.getProductById(req.params.id);
      if (!product) return sendError(res, 'Product not found', 404);
      return sendSuccess(res, product, 'Product details retrieved');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  createProduct: (req: Request, res: Response) => {
    try {
      const product = storeService.createProduct(req.body);
      return sendSuccess(res, product, 'Product added to store', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },

  updateProduct: (req: Request, res: Response) => {
    try {
      const product = storeService.updateProduct(req.params.id, req.body);
      if (!product) return sendError(res, 'Product not found', 404);
      return sendSuccess(res, product, 'Product updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  },
};
