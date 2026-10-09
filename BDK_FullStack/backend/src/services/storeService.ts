import { Product } from '../models/types.js';
import { mockProducts } from './mockData.js';

let products: Product[] = [...mockProducts];

export const storeService = {
  getAllProducts: (category?: string) => {
    if (category) {
      return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return products;
  },

  getProductById: (id: string) => products.find((p) => p.id === id),

  createProduct: (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    products.push(newProduct);
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    return products[index];
  },
};
