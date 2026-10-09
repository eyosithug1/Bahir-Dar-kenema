import React from 'react';
import { Calendar, MapPin, Ticket, Award, CheckCircle } from 'lucide-react';
import { Match } from '../../types';

interface MatchCardProps {
  match: Match;
  onBookTickets?: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onBookTickets }) => {
  const isCompleted = match.status === 'COMPLETED';

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: isCompleted ? '1px solid var(--border-color)' : '1px solid rgba(245, 158, 11, 0.3)',
      transition: 'var(--transition)',
    }}>
      {/* Top Competition & Date */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: 'var(--bdk-accent)', fontWeight: 600 }}>{match.competition}</span>
          <span className={`badge ${isCompleted ? 'badge-blue' : 'badge-gold'}`} style={{ fontSize: '0.65rem' }}>
            {match.status}
          </span>
        </div>

        {/* Teams and Score */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.75rem',
          margin: '1rem 0'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{match.homeTeam}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>HOME</div>
          </div>

          <div style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            minWidth: '70px'
          }}>
            {isCompleted ? (
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--bdk-gold)' }}>
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--bdk-gold)' }}>
                {match.time}
              </span>
            )}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{match.awayTeam}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>AWAY</div>
          </div>
        </div>

        {/* Events / Scorer details if completed */}
        {isCompleted && match.events && match.events.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem'
          }}>
            {match.events.map((e, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span>⚽ {e.player}</span>
                <span style={{ color: 'var(--bdk-gold)' }}>{e.minute}'</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.85rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={14} color="var(--bdk-gold)" />
          <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.venue}
          </span>
        </div>

        {!isCompleted && onBookTickets && (
          <button
            onClick={() => onBookTickets(match)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: 'var(--bdk-secondary)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Get Tickets
          </button>
        )}
      </div>
    </div>
  );
};
