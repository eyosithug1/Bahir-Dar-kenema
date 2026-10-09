import React from 'react';
import { Calendar, MapPin, Ticket, Shield } from 'lucide-react';
import { Match } from '../../types';

interface NextMatchCardProps {
  match: Match;
  onBookTickets: (match: Match) => void;
}

export const NextMatchCard: React.FC<NextMatchCardProps> = ({ match, onBookTickets }) => {
  return (
    <div className="glass-panel" style={{
      padding: '1.75rem',
      position: 'relative',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      background: 'linear-gradient(180deg, rgba(19, 27, 38, 0.9) 0%, rgba(10, 58, 64, 0.35) 100%)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-gold">UPCOMING FIXTURE</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{match.competition} • {match.round}</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--bdk-accent)', fontWeight: 600 }}>
          {match.time} ET
        </div>
      </div>

      {/* Versus Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1rem',
        margin: '1.5rem 0'
      }}>
        {/* Home Team */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a3a40 0%, #0284c7 100%)',
            border: '2px solid var(--bdk-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
          }}>
            BDK
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{match.homeTeam}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--bdk-accent)' }}>HOME</span>
        </div>

        {/* VS badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bdk-gold)',
            fontWeight: 900,
            fontSize: '0.85rem'
          }}>
            VS
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{match.date}</span>
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            STG
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{match.awayTeam}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AWAY</span>
        </div>
      </div>

      {/* Venue & Action Footer */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <MapPin size={16} color="var(--bdk-gold)" />
          <span>{match.venue}</span>
        </div>

        <button
          onClick={() => onBookTickets(match)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--bdk-secondary)',
            color: '#091c20',
            fontWeight: 700,
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
            transition: 'var(--transition)'
          }}
        >
          <Ticket size={16} />
          <span>Buy Match Tickets (from 100 ETB)</span>
        </button>
      </div>
    </div>
  );
};
