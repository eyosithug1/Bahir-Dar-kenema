import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import { LeagueStanding } from '../../types';

interface StandingsWidgetProps {
  standings: LeagueStanding[];
  onViewAll: () => void;
}

export const StandingsWidget: React.FC<StandingsWidgetProps> = ({ standings, onViewAll }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={18} color="var(--bdk-gold)" />
          <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>League Table</h3>
        </div>
        <button
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--bdk-accent)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}
        >
          <span>Full Table</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem', width: '28px' }}>#</th>
              <th style={{ padding: '0.5rem' }}>Club</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>PL</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>GD</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.slice(0, 5).map((row) => (
              <tr
                key={row.team}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: row.isBDK ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  fontWeight: row.isBDK ? 700 : 500,
                  color: row.isBDK ? '#fff' : 'var(--text-muted)'
                }}
              >
                <td style={{
                  padding: '0.65rem 0.5rem',
                  color: row.position === 1 ? 'var(--bdk-gold)' : 'var(--text-dim)',
                  fontWeight: 700
                }}>
                  {row.position}
                </td>
                <td style={{ padding: '0.65rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {row.isBDK && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bdk-gold)',
                      boxShadow: '0 0 6px var(--bdk-gold)'
                    }} />
                  )}
                  <span style={{ color: row.isBDK ? 'var(--bdk-gold)' : 'inherit' }}>{row.team}</span>
                </td>
                <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>{row.played}</td>
                <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', color: row.goalDifference > 0 ? '#34d399' : 'inherit' }}>
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td style={{
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center',
                  fontWeight: 800,
                  color: row.isBDK ? 'var(--bdk-gold)' : '#fff'
                }}>
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
