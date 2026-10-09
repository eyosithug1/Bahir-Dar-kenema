export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface Player {
  id: string;
  number: number;
  name: string;
  amharicName?: string;
  position: Position;
  nationality: string;
  age: number;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  image: string;
  biography: string;
  isCaptain?: boolean;
}

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub';
  player: string;
  team: string;
}

export interface Match {
  id: string;
  competition: string;
  round?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  isHome: boolean;
  opponentLogo: string;
  clubLogo: string;
  events?: MatchEvent[];
  highlightsUrl?: string;
}

export interface LeagueStanding {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  logo: string;
  isBDK?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Match Report' | 'Transfer' | 'Club News' | 'Press Release' | 'Community';
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  readTime: string;
  tags: string[];
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  availableSeats: number;
  benefits: string[];
}

export interface MatchTicketBooking {
  id: string;
  matchId: string;
  matchTitle: string;
  tierId: string;
  tierName: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'BOA' | 'Card';
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  qrCodeToken: string;
  bookedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Kits' | 'Apparel' | 'Accessories' | 'Memorabilia';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  sizes?: string[];
  inStock: boolean;
  rating: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'fan' | 'staff';
  phoneNumber?: string;
  membershipId?: string;
  createdAt: string;
}
