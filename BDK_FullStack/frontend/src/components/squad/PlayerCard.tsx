import React from 'react';
import { Award, Shield, User } from 'lucide-react';
import { Player } from '../../types';

interface PlayerCardProps {
  player: Player;
  onSelect: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSelect }) => {
  return (
    <div
      className="glass-panel"
      onClick={() => onSelect(player)}
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'var(--transition)',
        position: 'relative',
        border: '1px solid var(--border-color)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glow)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Player Image with Number Overlay */}
      <div style={{ position: 'relative', height: '240px', backgroundColor: '#07151a' }}>
        <img
          src={player.image}
          alt={player.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(11,15,23,0.95) 100%)'
        }} />

        {/* Shirt Number */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(10, 58, 64, 0.85)',
          border: '1px solid var(--border-glow)',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bdk-gold)',
          fontWeight: 900,
          fontSize: '1.1rem'
        }}>
          {player.number}
        </div>

        {/* Captain badge */}
        {player.isCaptain && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px'
          }}>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
              CAPTAIN
            </span>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--bdk-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
          {player.position}
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
          {player.name}
        </h3>
        {player.amharicName && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            {player.amharicName}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.4rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.6rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          marginTop: '0.75rem'
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>APPS</div>
            <div style={{ fontWeight: 800, color: '#fff' }}>{player.appearances}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>GOALS</div>
            <div style={{ fontWeight: 800, color: 'var(--bdk-gold)' }}>{player.goals}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)' }}>ASSISTS</div>
            <div style={{ fontWeight: 800, color: '#fff' }}>{player.assists}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
