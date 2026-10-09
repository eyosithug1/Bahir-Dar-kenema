BDK API ENDPOINTS - COMPLETE REFERENCE

Base URL: http://localhost:5000/api
All authenticated endpoints require: Authorization: Bearer {token}


AUTHENTICATION ENDPOINTS
========================

POST /auth/register
Request:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "admin|client" (optional, default: client)
}
Response: { success, message, token, user }


POST /auth/login
Request:
{
  "email": "string",
  "password": "string"
}
Response: { success, message, token, user }


GET /auth/me (Protected)
Response: { success, data: user }


POST /auth/logout (Protected)
Response: { success, message }


PRODUCT ENDPOINTS (SHOP)
========================

GET /products?category=value&search=value
Query Parameters:
- category: "Jerseys", "Training Wear", "Accessories", "Memorabilia", "Other"
- search: search term
Response: { success, count, data: [products] }


GET /products/:id
Response: { success, data: product }


POST /products (Admin Only - Protected)
Request (multipart/form-data):
{
  "name": "string",
  "description": "string",
  "price": number,
  "originalPrice": number,
  "discount": number (0-100),
  "category": "string",
  "stock": number,
  "images": [files]
}
Response: { success, message, data: product }


PUT /products/:id (Admin Only - Protected)
Request (multipart/form-data):
{
  "name": "string" (optional),
  "description": "string" (optional),
  "price": number (optional),
  "originalPrice": number (optional),
  "discount": number (optional),
  "category": "string" (optional),
  "stock": number (optional),
  "images": [files] (optional)
}
Response: { success, message, data: product }


DELETE /products/:id (Admin Only - Protected)
Response: { success, message }


DELETE /products/:productId/images/:imageId (Admin Only - Protected)
Response: { success, message, data: product }


GET /products/categories
Response: { success, data: [categories] }


ORDER ENDPOINTS
===============

POST /orders (Protected - Client)
Request:
{
  "items": [
    {
      "product": "productId",
      "quantity": number,
      "price": number
    }
  ],
  "totalPrice": number,
  "customerPhone": "string",
  "deliveryAddress": {
    "street": "string",
    "city": "string",
    "postalCode": "string"
  },
  "paymentMethod": "cash_on_delivery|chapa"
}
Response: { success, message, data: order }


GET /orders (Admin Only - Protected)
Response: { success, count, data: [orders] }


GET /orders/my-orders (Protected - Client)
Response: { success, count, data: [orders] }


GET /orders/:id (Protected)
Response: { success, data: order }


PUT /orders/:id/status (Admin Only - Protected)
Request:
{
  "status": "pending|confirmed|shipped|delivered|cancelled"
}
Response: { success, message, data: order }


PUT /orders/:id/cancel (Protected - Client)
Response: { success, message, data: order }


GET /orders/stats (Admin Only - Protected)
Response: { success, data: { totalOrders, pendingOrders, deliveredOrders, totalRevenue } }


NEWS ENDPOINTS
==============

GET /news?category=value&search=value
Query Parameters:
- category: "Match Report", "News", "Update", "Interview", "Live Score", "Event"
- search: search term
Response: { success, count, data: [articles] }


GET /news/:id
Response: { success, data: article }


POST /news (Admin Only - Protected)
Request (multipart/form-data):
{
  "title": "string",
  "description": "string",
  "content": "string",
  "category": "string",
  "tags": "comma,separated,tags",
  "featuredImage": file,
  "images": [files]
}
Response: { success, message, data: article }


PUT /news/:id (Admin Only - Protected)
Request (multipart/form-data):
{
  "title": "string" (optional),
  "description": "string" (optional),
  "content": "string" (optional),
  "category": "string" (optional),
  "tags": "string" (optional),
  "published": boolean (optional),
  "featuredImage": file (optional),
  "images": [files] (optional)
}
Response: { success, message, data: article }


DELETE /news/:id (Admin Only - Protected)
Response: { success, message }


PUT /news/:id/like (Protected)
Response: { success, message, likes: number }


POST /news/:id/comments (Protected - Client)
Request:
{
  "content": "string"
}
Response: { success, message, data: comment }


DELETE /news/:newsId/comments/:commentId (Protected - Author or Admin)
Response: { success, message }


GET /news/stats (Admin Only - Protected)
Response: { success, data: { totalArticles, publishedArticles, totalComments } }


LIVE SCORE / MATCH ENDPOINTS
=============================

GET /matches?status=upcoming|live|finished|postponed
Response: { success, count, data: [matches] }


GET /matches/upcoming
Response: { success, data: [upcoming matches] }


GET /matches/recent-results
Response: { success, data: [recent results] }


GET /matches/:id
Response: { success, data: match }


POST /matches (Admin Only - Protected)
Request:
{
  "matchTitle": "string",
  "homeTeam": "string",
  "awayTeam": "string",
  "matchDate": "ISO Date",
  "matchTime": "string",
  "venue": "string",
  "competition": "string"
}
Response: { success, message, data: match }


PUT /matches/:id/score (Admin Only - Protected)
Request:
{
  "homeScore": number,
  "awayScore": number,
  "status": "upcoming|live|finished|postponed"
}
Response: { success, message, data: match }


PUT /matches/:id (Admin Only - Protected)
Request:
{
  "matchTitle": "string" (optional),
  "homeTeam": "string" (optional),
  "awayTeam": "string" (optional),
  "matchDate": "ISO Date" (optional),
  "matchTime": "string" (optional),
  "venue": "string" (optional),
  "competition": "string" (optional),
  "status": "string" (optional),
  "lineups": object (optional),
  "statistics": object (optional),
  "highlights": "string URL" (optional)
}
Response: { success, message, data: match }


DELETE /matches/:id (Admin Only - Protected)
Response: { success, message }


COMMENT/DISCUSSION ENDPOINTS
=============================

GET /discussions
Response: { success, count, data: [comments] }


GET /discussions/news/:newsId
Response: { success, count, data: [comments on article] }


POST /discussions (Protected - Client)
Request:
{
  "text": "string"
}
Response: { success, message, data: comment }


POST /discussions/news/:newsId (Protected - Client)
Request:
{
  "text": "string"
}
Response: { success, message, data: comment }


PUT /discussions/:commentId (Protected - Author or Admin)
Request:
{
  "text": "string"
}
Response: { success, message, data: comment }


DELETE /discussions/:commentId (Protected - Author or Admin)
Response: { success, message }


PUT /discussions/:commentId/like (Protected)
Response: { success, message, likes: number }


GET /admin/comments (Admin Only - Protected)
Response: { success, count, data: [all comments] }


PUT /admin/comments/:commentId/moderate (Admin Only - Protected)
Request:
{
  "reason": "string"
}
Response: { success, message }


GET /admin/comments/stats (Admin Only - Protected)
Response: { success, data: { totalComments, generalWallComments, newsComments } }


ERROR RESPONSES
===============

All errors follow this format:
{
  "success": false,
  "message": "error message"
}

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error


TESTING WITH CURL
=================

Register:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+251900000000","password":"test123"}'

Login:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123"}'

Get all products:
curl http://localhost:5000/api/products

Create product (need token):
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jersey","description":"Official Jersey","price":850,"category":"Jerseys","stock":100}'

Get news:
curl http://localhost:5000/api/news
