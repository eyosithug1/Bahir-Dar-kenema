BDK FOOTBALL CLUB - FULL STACK PROJECT

Project Structure Overview
==========================

BDK_FullStack/
├── backend/                    # Node.js Express API
│   ├── models/                 # MongoDB Schemas
│   │   ├── User.js            # User model (admin/client)
│   │   ├── Product.js         # Shop products
│   │   ├── Order.js           # Customer orders
│   │   ├── News.js            # Blog articles
│   │   ├── LiveScore.js       # Match scores
│   │   └── Comment.js         # Fan comments
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── newsController.js
│   │   ├── liveScoreController.js
│   │   └── commentController.js
│   ├── routes/                 # API endpoints
│   │   └── index.js
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # JWT verification
│   │   └── errorHandler.js
│   ├── config/                 # Configuration
│   │   └── database.js        # MongoDB connection
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example           # Environment variables template
│
└── frontend/                   # React Application
    ├── src/
    │   ├── components/
    │   │   ├── Admin/         # Admin components
    │   │   │   ├── AdminLayout.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── ...
    │   │   └── Client/        # Client components
    │   │       ├── ClientLayout.jsx
    │   │       ├── Navbar.jsx
    │   │       └── ...
    │   ├── pages/             # Page components
    │   │   ├── Client/
    │   │   ├── Admin/
    │   │   └── Auth/
    │   ├── context/           # State management
    │   │   └── authStore.js   # Zustand store
    │   ├── services/          # API calls
    │   │   └── api.js
    │   ├── index.css          # Global styles
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json


TECHNOLOGY STACK
================

Backend:
- Node.js & Express.js
- MongoDB (NoSQL Database)
- JWT Authentication
- Multer (File uploads)
- Cloudinary (Image storage)
- Nodemailer (Email)

Frontend:
- React 18
- Vite (Build tool)
- Tailwind CSS
- React Router
- Zustand (State management)
- Axios (HTTP client)
- React Hot Toast (Notifications)


QUICK START
===========

BACKEND SETUP:
1. Navigate to backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Create .env file from .env.example:
   cp .env.example .env

4. Add your environment variables:
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   FRONTEND_URL=http://localhost:3000

5. Start the server:
   npm run dev

The API will run on http://localhost:5000


FRONTEND SETUP:
1. Navigate to frontend folder:
   cd frontend

2. Install dependencies:
   npm install

3. Start development server:
   npm run dev

The app will run on http://localhost:3000


DATABASE SETUP
==============

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas

2. Create a cluster (free tier available)

3. Get connection string and add to .env:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bdk_db

4. The application will automatically create collections on first use


API ENDPOINTS SUMMARY
=====================

AUTHENTICATION:
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
POST   /api/auth/logout        - Logout user

PRODUCTS:
GET    /api/products           - Get all products
GET    /api/products/:id       - Get single product
POST   /api/products           - Create product (Admin)
PUT    /api/products/:id       - Update product (Admin)
DELETE /api/products/:id       - Delete product (Admin)

ORDERS:
POST   /api/orders             - Create order (Client)
GET    /api/orders             - Get all orders (Admin)
GET    /api/orders/my-orders   - Get my orders (Client)
PUT    /api/orders/:id/status  - Update status (Admin)

NEWS:
GET    /api/news               - Get all news
GET    /api/news/:id           - Get article
POST   /api/news               - Create article (Admin)
PUT    /api/news/:id           - Update article (Admin)
DELETE /api/news/:id           - Delete article (Admin)

MATCHES:
GET    /api/matches            - Get all matches
POST   /api/matches            - Create match (Admin)
PUT    /api/matches/:id/score  - Update score (Admin)

DISCUSSIONS:
GET    /api/discussions        - Get fan discussions
POST   /api/discussions        - Post on fan wall (Client)
POST   /api/discussions/news/:newsId - Comment on news (Client)


PROJECT TIMELINE - 10 DAYS
==========================

DAY 1: Project setup, database schema, basic API structure
     - DONE: Folder setup, models created
     - TODO: Test database connection

DAY 2: User authentication system, JWT setup
     - TODO: Test register/login endpoints
     - TODO: Create auth pages UI

DAY 3: Product CRUD endpoints + Admin product page
     - TODO: Test product endpoints
     - TODO: Build admin product management UI

DAY 4: News CRUD endpoints + Admin news page
     - TODO: Test news endpoints
     - TODO: Build admin news management UI

DAY 5: Order system, basic cart functionality
     - TODO: Test order endpoints
     - TODO: Build client checkout flow

DAY 6: Client shop page, cart, checkout
     - TODO: Build shop UI
     - TODO: Integrate cart functionality

DAY 7: Client news page, comments system
     - TODO: Build news UI
     - TODO: Build comments UI

DAY 8: Fan discussion page, live score updates
     - TODO: Build fan wall UI
     - TODO: Build match score UI

DAY 9: Bug fixes, testing, refinements
     - TODO: Test all features
     - TODO: Fix bugs

DAY 10: Final testing, deployment
     - TODO: Deploy backend
     - TODO: Deploy frontend
     - TODO: Test live system


DEFAULT TEST CREDENTIALS
========================

After running backend, create a test admin:

POST to /api/auth/register
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@bdkenema.com",
  "phone": "+251900000000",
  "password": "admin123",
  "role": "admin"
}

For clients, register through the app UI


IMPORTANT NOTES
===============

1. Backend must run on port 5000
2. Frontend must run on port 3000
3. Both need to be running simultaneously for full functionality
4. Token is stored in localStorage on client
5. Remember to add proper error handling
6. Test all endpoints before deployment
7. Images are uploaded to file storage (will configure later)
8. Chapa payment integration added in Phase 2


FILE UPLOAD SETUP (Optional for now)
====================================

For image uploads, we'll use Cloudinary:

1. Create Cloudinary account: https://cloudinary.com
2. Get API credentials from dashboard
3. Add to .env:
   CLOUDINARY_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret

For now, images can be stored locally in /backend/uploads/


NEXT STEPS
==========

1. Install all dependencies
2. Set up MongoDB Atlas database
3. Create .env file with proper variables
4. Run backend: npm run dev (from backend folder)
5. Run frontend: npm run dev (from frontend folder)
6. Test authentication at http://localhost:3000/login
7. Create admin account via API
8. Start building components one by one

The complete project structure is ready. We'll build components progressively.

Let's go build this thing!
