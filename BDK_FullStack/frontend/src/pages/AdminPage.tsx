import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Match, Player, NewsArticle, TicketTier } from '../types';
import { api } from '../services/api';
import { Sparkles, Shield, Users, Calendar, Ticket, PlusCircle, CheckCircle } from 'lucide-react';

interface AdminPageProps {
  matches: Match[];
  players: Player[];
  news: NewsArticle[];
  tiers: TicketTier[];
  onRefreshData: () => void;
  onOpenAuth: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  matches,
  players,
  news,
  tiers,
  onRefreshData,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'matches' | 'players' | 'news' | 'bookings'>('matches');

  // Match form state
  const [newOpponent, setNewOpponent] = useState('');
  const [matchDate, setMatchDate] = useState('2026-10-18');
  const [matchTime, setMatchTime] = useState('16:00');
  const [isHome, setIsHome] = useState(true);
  const [matchSuccess, setMatchSuccess] = useState(false);

  // Player form state
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState(17);
  const [playerPosition, setPlayerPosition] = useState<'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('Midfielder');
  const [playerSuccess, setPlayerSuccess] = useState(false);

  // News form state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Match Report' | 'Transfer' | 'Club News' | 'Press Release' | 'Community'>('Club News');
  const [newsSuccess, setNewsSuccess] = useState(false);

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpponent) return;
    const newMatch: Match = {
      id: `m-${Date.now()}`,
      competition: 'BetKing Ethiopian Premier League',
      round: 'Upcoming Fixture',
      homeTeam: isHome ? 'Bahir Dar Kenema' : newOpponent,
      awayTeam: isHome ? newOpponent : 'Bahir Dar Kenema',
      date: matchDate,
      time: matchTime,
      venue: isHome ? 'Bahir Dar International Stadium' : 'Away Arena',
      status: 'UPCOMING',
      isHome,
      clubLogo: 'https://placehold.co/100x100/104f55/ffffff?text=BDK',
      opponentLogo: 'https://placehold.co/100x100/64748b/ffffff?text=OPP',
    };
    matches.unshift(newMatch);
    setMatchSuccess(true);
    setTimeout(() => setMatchSuccess(false), 2500);
    setNewOpponent('');
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName) return;
    const newP: Player = {
      id: `p-${Date.now()}`,
      name: playerName,
      number: playerNumber,
      position: playerPosition,
      nationality: 'Ethiopia',
      age: 23,
      appearances: 0,
      goals: 0,
      assists: 0,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      biography: 'Newly signed talent for the Waves of Tana.',
    };
    players.push(newP);
    setPlayerSuccess(true);
    setTimeout(() => setPlayerSuccess(false), 2500);
    setPlayerName('');
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary) return;
    const newArticle: NewsArticle = {
      id: `news-${Date.now()}`,
      title: newsTitle,
      category: newsCategory,
      summary: newsSummary,
      content: `${newsSummary}\n\nBahir Dar Kenema continue their pursuit for excellence across all sporting disciplines.`,
      author: user?.name || 'BDK Press Desk',
      publishedAt: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80',
      readTime: '3 min read',
      tags: ['Official', 'ClubNews']
    };
    news.unshift(newArticle);
    setNewsSuccess(true);
    setTimeout(() => setNewsSuccess(false), 2500);
    setNewsTitle('');
    setNewsSummary('');
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={24} color="var(--bdk-gold)" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
              BDK Club Management & Admin Portal
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage fixtures, squad rosters, publish announcements, and track matchday ticketing.
          </p>
        </div>

        {!user && (
          <button
            onClick={onOpenAuth}
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: 'var(--bdk-secondary)',
              color: '#000',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Admin Sign In
          </button>
        )}
      </div>

      {/* Quick Server Status Bar */}
      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Backend API Engine: Operational</span>
          <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Port: 5000</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Active User: <strong style={{ color: 'var(--bdk-gold)' }}>{user ? `${user.name} (${user.role})` : 'Guest Administrator'}</strong>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        {[
          { id: 'matches', label: 'Schedule Match Fixture', icon: Calendar },
          { id: 'players', label: 'Squad Registry', icon: Users },
          { id: 'news', label: 'Publish News', icon: Sparkles },
          { id: 'bookings', label: 'Ticketing Overview', icon: Ticket },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: activeSubTab === tab.id ? '1px solid var(--bdk-gold)' : '1px solid var(--border-color)',
              backgroundColor: activeSubTab === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              color: activeSubTab === tab.id ? 'var(--bdk-gold)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub Tab: Matches */}
      {activeSubTab === 'matches' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Schedule New Premier League Fixture
          </h3>

          {matchSuccess && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              <span>Fixture added to schedule successfully!</span>
            </div>
          )}

          <form onSubmit={handleAddMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Opponent Club Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sidama Coffee SC"
                value={newOpponent}
                onChange={(e) => setNewOpponent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Match Date
                </label>
                <input
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Kickoff Time (ET)
                </label>
                <input
                  type="time"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="radio"
                  name="matchVenue"
                  checked={isHome}
                  onChange={() => setIsHome(true)}
                />
                <span>Home Match (Bahir Dar Stadium)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="radio"
                  name="matchVenue"
                  checked={!isHome}
                  onChange={() => setIsHome(false)}
                />
                <span>Away Match</span>
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#091c20',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                marginTop: '0.5rem'
              }}
            >
              Add Fixture
            </button>
          </form>
        </div>
      )}

      {/* Sub Tab: Players */}
      {activeSubTab === 'players' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Register Player to First Team Squad
          </h3>

          {playerSuccess && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              <span>Player added to squad roster!</span>
            </div>
          )}

          <form onSubmit={handleAddPlayer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Full Player Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Biruk Getachew"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Jersey Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Field Position
                </label>
                <select
                  value={playerPosition}
                  onChange={(e) => setPlayerPosition(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#091c20',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                marginTop: '0.5rem'
              }}
            >
              Enroll Player
            </button>
          </form>
        </div>
      )}

      {/* Sub Tab: News */}
      {activeSubTab === 'news' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Publish Official Club Announcement
          </h3>

          {newsSuccess && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              <span>News article published to homepage!</span>
            </div>
          )}

          <form onSubmit={handleAddNews} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Headline Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BDK Secures Crucial 3 Points Against St. George"
                value={newsTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Category
              </label>
              <select
                value={newsCategory}
                onChange={(e) => setNewsCategory(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Club News">Club News</option>
                <option value="Match Report">Match Report</option>
                <option value="Transfer">Transfer</option>
                <option value="Press Release">Press Release</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Summary & Content *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write article summary..."
                value={newsSummary}
                onChange={(e) => setNewsSummary(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#091c20',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                marginTop: '0.5rem'
              }}
            >
              Publish Article
            </button>
          </form>
        </div>
      )}

      {/* Sub Tab: Bookings */}
      {activeSubTab === 'bookings' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
            Matchday Ticketing Revenue & Live Capacity
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>STADIUM TICKETS SOLD</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>24,850</div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem' }}>62% of allocated terrace</div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>MATCHDAY REVENUE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--bdk-gold)', marginTop: '0.2rem' }}>4,120,000 ETB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--bdk-accent)', marginTop: '0.2rem' }}>Telebirr / CBE Birr Settlements</div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>VIP BOX OCCUPANCY</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>96%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--bdk-gold)', marginTop: '0.2rem' }}>480 / 500 VIP Seats</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
