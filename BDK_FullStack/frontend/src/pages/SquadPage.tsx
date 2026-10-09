import React, { useState } from 'react';
import { Player, Position } from '../types';
import { PlayerCard } from '../components/squad/PlayerCard';
import { Modal } from '../components/common/Modal';
import { Users, Award, Shield } from 'lucide-react';

interface SquadPageProps {
  players: Player[];
}

export const SquadPage: React.FC<SquadPageProps> = ({ players }) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  const filteredPlayers = players.filter((p) => {
    if (selectedPosition === 'ALL') return true;
    return p.position.toUpperCase() === selectedPosition;
  });

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Users size={22} color="var(--bdk-gold)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
            First Team Squad 2026/27
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Meet the players and coaching staff representing Bahir Dar Kenema in domestic and continental competitions.
        </p>
      </div>

      {/* Position Filter */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        {['ALL', 'GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'].map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: selectedPosition === pos ? '1px solid var(--bdk-gold)' : '1px solid var(--border-color)',
              backgroundColor: selectedPosition === pos ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              color: selectedPosition === pos ? 'var(--bdk-gold)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {pos === 'ALL' ? 'All Squad' : `${pos}s`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-responsive-4">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} onSelect={setActivePlayer} />
        ))}
      </div>

      {/* Player Detail Modal */}
      {activePlayer && (
        <Modal
          isOpen={!!activePlayer}
          onClose={() => setActivePlayer(null)}
          title={`#${activePlayer.number} ${activePlayer.name}`}
          maxWidth="580px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <img
                src={activePlayer.image}
                alt={activePlayer.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--bdk-gold)' }}
              />
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.3rem' }}>
                  {activePlayer.position}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{activePlayer.name}</h3>
                {activePlayer.amharicName && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--bdk-accent)', marginTop: '0.1rem' }}>
                    {activePlayer.amharicName}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Nationality: {activePlayer.nationality} • Age: {activePlayer.age}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {activePlayer.biography}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-surface)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>APPEARANCES</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>{activePlayer.appearances}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>GOALS</div>
                <div style={{ color: 'var(--bdk-gold)', fontSize: '1.2rem', fontWeight: 800 }}>{activePlayer.goals}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>ASSISTS</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>{activePlayer.assists}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>STATUS</div>
                <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>ACTIVE</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
