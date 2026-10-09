import React from 'react';
import { Users, Award, Shield, Flame } from 'lucide-react';

export const ClubStats: React.FC = () => {
  const stats = [
    { label: 'Stadium Capacity', value: '60,000+', sub: 'Bahir Dar Int Stadium', icon: Shield, color: '#38bdf8' },
    { label: 'Active Fan Base', value: '120,000+', sub: 'Registered Supporters', icon: Users, color: '#fbbf24' },
    { label: 'Current League Form', value: 'WWWDW', sub: 'Unbeaten in 5 games', icon: Flame, color: '#f97316' },
    { label: 'Founded Year', value: '1973', sub: '50+ Years Heritage', icon: Award, color: '#34d399' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      margin: '3rem 0'
    }}>
      {stats.map((item) => (
        <div key={item.label} className="glass-panel" style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          border: '1px solid var(--border-color)',
          transition: 'var(--transition)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <item.icon size={24} color={item.color} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              {item.value}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {item.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
