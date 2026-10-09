import React, { useState } from 'react';
import { MatchCard } from '../components/matches/MatchCard';
import { Match } from '../types';
import { Calendar, Filter } from 'lucide-react';

interface MatchesPageProps {
  matches: Match[];
  onBookTickets: (match: Match) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({ matches, onBookTickets }) => {
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

  const filteredMatches = matches.filter((m) => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Calendar size={22} color="var(--bdk-gold)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
            Fixtures & Match Center
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          BetKing Ethiopian Premier League & CAF Confederation Cup schedule for Bahir Dar Kenema SC.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        {(['ALL', 'UPCOMING', 'COMPLETED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: filter === tab ? '1px solid var(--bdk-gold)' : '1px solid var(--border-color)',
              backgroundColor: filter === tab ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              color: filter === tab ? 'var(--bdk-gold)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {tab === 'ALL' ? 'All Matches' : tab === 'UPCOMING' ? 'Upcoming Fixtures' : 'Recent Results'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-responsive-3">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} onBookTickets={onBookTickets} />
        ))}
      </div>
    </div>
  );
};
