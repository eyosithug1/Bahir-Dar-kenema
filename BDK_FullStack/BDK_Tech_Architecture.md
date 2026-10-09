# BDK Website - Technical Architecture Overview

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT SIDE (React)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages/Components:                                       │  │
│  │  • Home/Hero                                            │  │
│  │  • About Club                                           │  │
│  │  • Team/Players                                         │  │
│  │  • News/Blog                                            │  │
│  │  • Fixtures & Results                                  │  │
│  │  • Shop/E-commerce                                      │  │
│  │  • Ticket Booking                                       │  │
│  │  • Gallery                                              │  │
│  │  • Fan Zone                                             │  │
│  │  • Contact/Support                                      │  │
│  │  • User Dashboard (Fan Account)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Admin Dashboard:                                        │  │
│  │  • News Management                                       │  │
│  │  • Player Management                                     │  │
│  │  • Match Management                                      │  │
│  │  • Shop Products                                         │  │
│  │  • Orders & Analytics                                    │  │
│  │  • User Management                                       │  │
│  │  • Gallery Management                                    │  │
│  │  • Settings                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Tech: React, React Router, Tailwind CSS, Redux, Axios        │
└────────────┬────────────────────────────────────┬──────────────┘
             │                                    │
             │ API Calls (REST/GraphQL)           │ File Uploads
             │                                    │
┌────────────▼────────────────────────────────────▼──────────────┐
│                    API LAYER (Node.js/Express)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RESTful Endpoints:                                      │  │
│  │  • /api/auth (Register, Login, Logout)                  │  │
│  │  • /api/players (Get, Create, Update, Delete)           │  │
│  │  • /api/news (Get, Create, Update, Delete)              │  │
│  │  • /api/matches (Get, Create, Update, Results)          │  │
│  │  • /api/shop (Products, Categories, Cart, Orders)       │  │
│  │  • /api/tickets (Available, Purchase, History)          │  │
│  │  • /api/users (Profile, Preferences, Wishlist)          │  │
│  │  • /api/analytics (Traffic, Sales, Engagement)          │  │
│  │  • /api/gallery (Images, Upload, Organize)              │  │
│  │  • /api/contact (Submissions, FAQs)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware:                                             │  │
│  │  • Authentication (JWT)                                  │  │
│  │  • Authorization (Role-based)                            │  │
│  │  • Input Validation                                      │  │
│  │  • Error Handling                                        │  │
│  │  • Logging                                               │  │
│  │  • CORS                                                  │  │
│  │  • Rate Limiting                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Third-party Integrations:                               │  │
│  │  • Email Service (Nodemailer)                            │  │
│  │  • Payment Gateway (Stripe/PayPal)                       │  │
│  │  • File Storage (AWS S3/Cloudinary)                      │  │
│  │  • SMS Notifications                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Tech: Node.js, Express, JWT, Multer, Validation Libraries    │
└────────────┬─────────────────────────────────────────────────────┘
             │
             │ Database Queries
             │
┌────────────▼──────────────────────────────────────────────────┐
│                   DATABASE LAYER (MongoDB)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Collections:                                            │  │
│  │  • users                → Fan/Admin accounts            │  │
│  │  • players              → Player data & stats           │  │
│  │  • news                 → Blog/news articles            │  │
│  │  • matches              → Fixtures & results            │  │
│  │  • products             → Shop items                    │  │
│  │  • orders               → Purchase history              │  │
│  │  • tickets              → Ticket bookings               │  │
│  │  • reviews              → Product/match reviews         │  │
│  │  • gallery              → Image metadata                │  │
│  │  • settings             → Club configuration            │  │
│  │  • faq                  → Frequently asked questions    │  │
│  │  • analytics            → Traffic & engagement data     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  Tech: MongoDB Atlas (cloud) or Local MongoDB Instance        │
└────────────┬──────────────────────────────────────────────────┘
             │
             │ Store/Retrieve Files
             │
┌────────────▼──────────────────────────────────────────────────┐
│              FILE STORAGE (AWS S3 / Cloudinary)                │
│  • Product images                                             │
│  • Player photos                                              │
│  • Gallery images                                             │
│  • User avatars                                               │
│  • Match highlights/videos                                    │
└───────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA OVERVIEW

### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  role: Enum ["fan", "admin", "moderator"],
  avatar: String (URL),
  bio: String,
  preferences: {
    language: String,
    emailNotifications: Boolean,
    newsletter: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Players Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  number: Number,
  position: String,
  country: String,
  age: Number,
  height: String,
  weight: String,
  joinedDate: Date,
  bio: String,
  stats: {
    appearances: Number,
    goals: Number,
    assists: Number,
    yellowCards: Number,
    redCards: Number
  },
  photo: String (URL),
  socialMedia: {
    instagram: String,
    twitter: String
  },
  achievements: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### **News Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  content: String (rich text),
  author: ObjectId (reference to Users),
  category: String,
  tags: [String],
  featuredImage: String (URL),
  excerpt: String,
  published: Boolean,
  publishedAt: Date,
  viewCount: Number,
  likes: [ObjectId],
  comments: [
    {
      _id: ObjectId,
      author: ObjectId,
      content: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### **Matches Collection**
```javascript
{
  _id: ObjectId,
  homeTeam: String,
  awayTeam: String,
  homeTeamLogo: String (URL),
  awayTeamLogo: String (URL),
  date: Date,
  venue: String,
  competition: String,
  status: Enum ["upcoming", "live", "finished", "postponed"],
  homeScore: Number,
  awayScore: Number,
  lineups: {
    home: [ObjectId (references to Players)],
    away: [ObjectId]
  },
  highlights: String (video URL),
  statistics: {
    possession: { home: Number, away: Number },
    shots: { home: Number, away: Number },
    fouls: { home: Number, away: Number }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Products Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  sku: String (unique),
  description: String,
  category: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  stock: Number,
  images: [String] (URLs),
  sizes: [String],
  colors: [String],
  rating: Number,
  reviews: [ObjectId],
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Orders Collection**
```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to Users),
  orderNumber: String (unique),
  items: [
    {
      product: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  status: Enum ["pending", "confirmed", "shipped", "delivered", "cancelled"],
  shippingAddress: {
    street: String,
    city: String,
    country: String,
    postalCode: String
  },
  paymentMethod: String,
  paymentStatus: Enum ["pending", "completed", "failed"],
  transactionId: String,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Tickets Collection**
```javascript
{
  _id: ObjectId,
  match: ObjectId (reference to Matches),
  user: ObjectId (reference to Users),
  ticketType: Enum ["vip", "regular", "student"],
  price: Number,
  quantity: Number,
  seatNumber: String,
  qrCode: String,
  status: Enum ["active", "used", "cancelled"],
  purchasedAt: Date
}
```

---

## 🔐 Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage/cookie)
   ↓
5. Client includes token in request headers
   ↓
6. Server verifies token & authorizes action
   ↓
7. Route handler executes based on user role
```

---

## 📱 API Endpoints Summary

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### **Players**
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get single player
- `POST /api/players` - Create player (Admin)
- `PUT /api/players/:id` - Update player (Admin)
- `DELETE /api/players/:id` - Delete player (Admin)

### **News**
- `GET /api/news` - List all news
- `GET /api/news/:id` - Get single article
- `POST /api/news` - Create article (Admin)
- `PUT /api/news/:id` - Update article (Admin)
- `DELETE /api/news/:id` - Delete article (Admin)
- `POST /api/news/:id/like` - Like article (Fan)
- `POST /api/news/:id/comment` - Comment on article (Fan)

### **Matches**
- `GET /api/matches` - List matches
- `GET /api/matches/:id` - Get match details
- `POST /api/matches` - Create match (Admin)
- `PUT /api/matches/:id` - Update match (Admin)
- `PUT /api/matches/:id/score` - Update live score (Admin)

### **Shop**
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/cart/add` - Add to cart (Fan)
- `GET /api/cart` - Get cart (Fan)
- `POST /api/orders` - Create order (Fan)
- `GET /api/orders/:id` - Get order status (Fan)

### **Users**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id/orders` - Get user orders
- `POST /api/users/:id/wishlist/add` - Add to wishlist

### **Admin Analytics**
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/sales` - Sales data
- `GET /api/analytics/traffic` - Traffic stats
- `GET /api/analytics/users` - User statistics

---

## 🚀 Deployment Strategy

### **Frontend Deployment**
```
Option 1: Vercel (Recommended for React)
- Automatic deployments from Git
- Zero configuration
- Great performance
- Free tier available

Option 2: Netlify
- Continuous deployment
- Form handling
- Edge functions
- Free tier available

Option 3: AWS S3 + CloudFront
- More control
- Better for Ethiopia region
- CDN for faster delivery
```

### **Backend Deployment**
```
Option 1: Railway
- Simple deployment
- Affordable
- Good uptime
- Easy MongoDB integration

Option 2: Render
- Free tier available
- Good performance
- Easy scaling

Option 3: Heroku (if free tier exists)
- Simplest to start
- Pay-as-you-go

Option 4: AWS EC2
- Full control
- Scalable
- More complex setup
```

### **Database Deployment**
```
MongoDB Atlas (Recommended)
- Cloud-hosted MongoDB
- Free tier with 512MB storage
- Auto-backups
- Easy scaling
- Good for Ethiopia region availability
```

### **File Storage**
```
Option 1: Cloudinary
- Image optimization
- CDN included
- Free tier
- Easy integration

Option 2: AWS S3
- More control
- Cost-effective at scale
- CDN integration
```

---

## ⚡ Performance Considerations

1. **Image Optimization**
   - Use WebP format where possible
   - Implement responsive images
   - Lazy load gallery images
   - Compress before upload

2. **Database Indexing**
   - Index frequently queried fields
   - Create compound indexes for common filters
   - Monitor query performance

3. **API Caching**
   - Cache product listings
   - Cache player data
   - Implement Redis for session management

4. **Frontend Optimization**
   - Code splitting by route
   - Lazy load components
   - Minify and bundle assets
   - Service workers for offline support

5. **CDN Usage**
   - Static assets via CDN
   - Images via CDN
   - API responses cached appropriately

---

## 🔒 Security Measures

1. **Authentication & Authorization**
   - JWT tokens with expiration
   - Role-based access control
   - Secure password hashing (bcrypt)
   - HTTPS only

2. **Data Protection**
   - Input validation on all endpoints
   - SQL injection prevention
   - XSS protection
   - CSRF tokens

3. **API Security**
   - Rate limiting
   - CORS configuration
   - API key management
   - Audit logging

4. **File Upload Security**
   - File type validation
   - File size limits
   - Malware scanning
   - Safe storage outside webroot

---

## 📈 Scalability Roadmap

### **Phase 1 (Current)**
- Single Node.js instance
- Shared database
- Basic caching

### **Phase 2 (Growth)**
- Load balancer
- Multiple Node.js instances
- Database replication
- Redis caching layer
- CDN for static assets

### **Phase 3 (Scale)**
- Microservices architecture
- Message queues (RabbitMQ/Kafka)
- Advanced caching strategies
- Database sharding
- Container orchestration (Kubernetes)

---

This architecture is designed to be **scalable**, **maintainable**, and **user-friendly** for both fans and administrators!
