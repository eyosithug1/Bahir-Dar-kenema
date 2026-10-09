# ⚽ Bahir Dar Kenema FC (BDK) - Backend API

RESTful API backend for Bahir Dar Kenema Football Club ("The Waves of Tana"), built with Node.js, Express, and TypeScript.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file or copy from `.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=bahir_dar_kenema_dev_secret_key_2026
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check & club metadata |
| `GET` | `/api/v1/matches` | List all fixtures & results |
| `GET` | `/api/v1/matches/upcoming` | Upcoming match fixtures |
| `GET` | `/api/v1/matches/results` | Recent match scores & stats |
| `GET` | `/api/v1/matches/standings` | BetKing EPL league table |
| `POST` | `/api/v1/matches` | Schedule a new match fixture |
| `GET` | `/api/v1/players` | First team squad list |
| `POST` | `/api/v1/players` | Register new player to squad |
| `GET` | `/api/v1/news` | Club news & press releases |
| `POST` | `/api/v1/news` | Publish new news article |
| `GET` | `/api/v1/tickets/tiers` | Stadium seating tiers & pricing |
| `POST` | `/api/v1/tickets/book` | Book match tickets & generate QR token |
| `GET` | `/api/v1/products` | Official merchandise catalog |
| `POST` | `/api/v1/auth/login` | Supporter / Admin authentication |
