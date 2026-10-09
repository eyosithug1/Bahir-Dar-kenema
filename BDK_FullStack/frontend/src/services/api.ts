import { Player, Match, LeagueStanding, NewsArticle, TicketTier, MatchTicketBooking, Product, User } from '../types';

const API_BASE = 'http://localhost:5000/api/v1';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`[BDK API Fallback] ${endpoint} request failed, utilizing client fallback:`, err);
    throw err;
  }
}

export const api = {
  // Matches & Standings
  getMatches: () => fetchJson<Match[]>('/matches'),
  getUpcomingMatches: () => fetchJson<Match[]>('/matches/upcoming'),
  getResults: () => fetchJson<Match[]>('/matches/results'),
  getStandings: () => fetchJson<LeagueStanding[]>('/matches/standings'),

  // Players & Squad
  getPlayers: (position?: string) => fetchJson<Player[]>(position ? `/players?position=${position}` : '/players'),
  getPlayerById: (id: string) => fetchJson<Player>(`/players/${id}`),

  // News
  getNews: (category?: string) => fetchJson<NewsArticle[]>(category ? `/news?category=${category}` : '/news'),
  getArticleById: (id: string) => fetchJson<NewsArticle>(`/news/${id}`),

  // Tickets
  getTicketTiers: () => fetchJson<TicketTier[]>('/tickets/tiers'),
  bookTicket: (data: {
    matchId: string;
    tierId: string;
    quantity: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    paymentMethod: string;
  }) => fetchJson<MatchTicketBooking>('/tickets/book', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAllBookings: () => fetchJson<MatchTicketBooking[]>('/tickets/bookings'),

  // Products / Store
  getProducts: (category?: string) => fetchJson<Product[]>(category ? `/products?category=${category}` : '/products'),
  getProductById: (id: string) => fetchJson<Product>(`/products/${id}`),

  // Auth
  login: (email: string, password?: string) => fetchJson<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (name: string, email: string, phoneNumber?: string) => fetchJson<{ user: User; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phoneNumber }),
  }),
};
