import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/store/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { TicketBookingModal } from './components/tickets/TicketBookingModal';

import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { SquadPage } from './pages/SquadPage';
import { NewsPage } from './pages/NewsPage';
import { TicketsPage } from './pages/TicketsPage';
import { StorePage } from './pages/StorePage';
import { StandingsPage } from './pages/StandingsPage';
import { AdminPage } from './pages/AdminPage';

import { api } from './services/api';
import { Match, Player, NewsArticle, LeagueStanding, TicketTier, Product } from './types';

// Rich fallback data to ensure the UI loads instantaneously even before backend is spun up
import {
  mockMatches,
  mockPlayers,
  mockNews,
  mockStandings,
  mockTicketTiers,
  mockProducts,
} from './mockSeed';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bookingMatch, setBookingMatch] = useState<Match | null>(null);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  // Application Data States
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const [standings, setStandings] = useState<LeagueStanding[]>(mockStandings);
  const [tiers, setTiers] = useState<TicketTier[]>(mockTicketTiers);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const loadDataFromApi = async () => {
    try {
      const [m, p, n, s, t, prod] = await Promise.all([
        api.getMatches().catch(() => mockMatches),
        api.getPlayers().catch(() => mockPlayers),
        api.getNews().catch(() => mockNews),
        api.getStandings().catch(() => mockStandings),
        api.getTicketTiers().catch(() => mockTicketTiers),
        api.getProducts().catch(() => mockProducts),
      ]);
      setMatches(m);
      setPlayers(p);
      setNews(n);
      setStandings(s);
      setTiers(t);
      setProducts(prod);
    } catch (err) {
      console.log('Using seeded data for BDK client:', err);
    }
  };

  useEffect(() => {
    loadDataFromApi();
  }, []);

  const handleBookTickets = (match: Match) => {
    setBookingMatch(match);
  };

  const handleSelectArticle = (article: NewsArticle) => {
    setActiveArticle(article);
    setActiveTab('news');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content View */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomePage
            matches={matches}
            standings={standings}
            news={news}
            setActiveTab={setActiveTab}
            onBookTickets={handleBookTickets}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesPage matches={matches} onBookTickets={handleBookTickets} />
        )}

        {activeTab === 'standings' && (
          <StandingsPage standings={standings} />
        )}

        {activeTab === 'squad' && (
          <SquadPage players={players} />
        )}

        {activeTab === 'tickets' && (
          <TicketsPage matches={matches} tiers={tiers} />
        )}

        {activeTab === 'store' && (
          <StorePage products={products} />
        )}

        {activeTab === 'news' && (
          <NewsPage
            news={news}
            activeArticle={activeArticle}
            setActiveArticle={setActiveArticle}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            matches={matches}
            players={players}
            news={news}
            tiers={tiers}
            onRefreshData={loadDataFromApi}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Modals and Drawers */}
      <CartDrawer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {bookingMatch && (
        <TicketBookingModal
          isOpen={!!bookingMatch}
          onClose={() => setBookingMatch(null)}
          match={bookingMatch}
          tiers={tiers}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
