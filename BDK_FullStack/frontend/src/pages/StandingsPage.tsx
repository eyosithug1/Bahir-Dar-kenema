import React from 'react';
import { LeagueStanding } from '../types';
import { Trophy, Award } from 'lucide-react';

interface StandingsPageProps {
  standings: LeagueStanding[];
}

export const StandingsPage: React.FC<StandingsPageProps> = ({ standings }) => {
  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Trophy size={24} color="var(--bdk-gold)" />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
            BetKing Ethiopian Premier League Table
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          2026/27 Official League Standings, Goal Differences, and Recent Form.
        </p>
      </div>

      {/* Standings Table Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{
              color: 'var(--text-dim)',
              borderBottom: '1px solid var(--border-color)',
              textAlign: 'left',
              fontSize: '0.8rem',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '0.75rem 1rem', width: '36px' }}>POS</th>
              <th style={{ padding: '0.75rem 1rem' }}>CLUB</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>MP</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>W</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>D</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>L</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>GF</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>GA</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>GD</th>
              <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>FORM</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr
                key={row.team}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: row.isBDK ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  fontWeight: row.isBDK ? 800 : 500,
                  color: row.isBDK ? '#fff' : 'var(--text-muted)'
                }}
              >
                <td style={{
                  padding: '1rem',
                  color: row.position === 1 ? 'var(--bdk-gold)' : row.position <= 2 ? 'var(--bdk-accent)' : 'var(--text-dim)',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  {row.position}
                </td>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {row.isBDK && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bdk-gold)',
                      boxShadow: '0 0 8px var(--bdk-gold)'
                    }} />
                  )}
                  <span style={{ color: row.isBDK ? 'var(--bdk-gold)' : '#fff', fontSize: '0.95rem' }}>
                    {row.team}
                  </span>
                  {row.position === 1 && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>LEADER</span>}
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{row.played}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{row.won}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{row.drawn}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{row.lost}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{row.goalsFor}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{row.goalsAgainst}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center', color: row.goalDifference > 0 ? '#34d399' : 'inherit' }}>
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem' }}>
                    {row.form.map((res, i) => (
                      <span
                        key={i}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '3px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          backgroundColor: res === 'W' ? '#10b981' : res === 'D' ? '#64748b' : '#ef4444',
                          color: '#fff'
                        }}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: 900,
                  fontSize: '1.15rem',
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
