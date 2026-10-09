import axios from 'axios';

const API_URL = '/api';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      // allow guest viewing without harsh redirect
    }
    return Promise.reject(error);
  }
);

// ============== AUTH ==============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// ============== USERS ==============
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleBan: (id) => api.put(`/admin/users/${id}/ban`)
};

// ============== SQUAD / PLAYERS ==============
export const playerAPI = {
  getAll: (params) => api.get('/players', { params }),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post('/players', data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`)
};

// ============== TICKETS ==============
export const ticketAPI = {
  getTiers: () => api.get('/tickets/tiers'),
  bookTicket: (data) => api.post('/tickets/book', data),
  getMyBookings: () => api.get('/tickets/my-bookings'),
  getAllBookings: () => api.get('/tickets/admin/bookings')
};

// ============== PRODUCTS ==============
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`)
};

// ============== ORDERS ==============
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getStats: () => api.get('/orders/stats')
};

// ============== NEWS ==============
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
  toggleLike: (id) => api.put(`/news/${id}/like`),
  addComment: (id, content) => api.post(`/news/${id}/comments`, { content }),
  deleteComment: (newsId, commentId) => api.delete(`/news/${newsId}/comments/${commentId}`),
  getStats: () => api.get('/news/stats')
};

// ============== LIVE SCORES / MATCHES ==============
export const liveScoreAPI = {
  getAll: (params) => api.get('/matches', { params }),
  getById: (id) => api.get(`/matches/${id}`),
  getUpcoming: () => api.get('/matches/upcoming'),
  getRecentResults: () => api.get('/matches/recent-results'),
  create: (data) => api.post('/matches', data),
  updateScore: (id, data) => api.put(`/matches/${id}/score`, data),
  update: (id, data) => api.put(`/matches/${id}`, data),
  delete: (id) => api.delete(`/matches/${id}`)
};

// ============== COMMENTS/DISCUSSIONS ==============
export const commentAPI = {
  getFanDiscussions: () => api.get('/discussions'),
  getNewsComments: (newsId) => api.get(`/discussions/news/${newsId}`),
  postOnWall: (text) => api.post('/discussions', { text }),
  postOnNews: (newsId, text) => api.post(`/discussions/news/${newsId}`, { text }),
  reply: (commentId, data) => api.post(`/discussions/${commentId}/reply`, data),
  toggleReplyLike: (commentId, replyId) => api.put(`/discussions/${commentId}/replies/${replyId}/like`),
  deleteReply: (commentId, replyId) => api.delete(`/discussions/${commentId}/replies/${replyId}`),
  update: (id, text) => api.put(`/discussions/${id}`, { text }),
  delete: (id) => api.delete(`/discussions/${id}`),
  toggleLike: (id) => api.put(`/discussions/${id}/like`),
  getAllComments: () => api.get('/admin/comments'),
  moderate: (id, reason) => api.put(`/admin/comments/${id}/moderate`, { reason }),
  getStats: () => api.get('/admin/comments/stats')
};

// ============== HERO EVENT CAROUSEL ==============
export const heroEventAPI = {
  getActive: () => api.get('/hero-events'),
  getAllAdmin: () => api.get('/admin/hero-events'),
  create: (data) => api.post('/admin/hero-events', data),
  update: (id, data) => api.put(`/admin/hero-events/${id}`, data),
  toggleActive: (id) => api.put(`/admin/hero-events/${id}/toggle`),
  delete: (id) => api.delete(`/admin/hero-events/${id}`)
};

// ============== UPLOAD ==============
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
