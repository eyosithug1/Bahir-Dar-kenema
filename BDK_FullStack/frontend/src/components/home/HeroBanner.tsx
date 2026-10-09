import React from 'react';
import { Ticket, ShoppingBag, Trophy, Flame, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onBuyTickets: () => void;
  onExploreStore: () => void;
  onViewSquad: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onBuyTickets,
  onExploreStore,
  onViewSquad,
}) => {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginTop: '1.5rem',
      marginBottom: '3rem',
      border: '1px solid var(--border-glow)',
      background: 'linear-gradient(135deg, rgba(6, 35, 39, 0.95) 0%, rgba(10, 58, 64, 0.85) 50%, rgba(2, 44, 67, 0.95) 100%)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Background Graphic Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '60%',
        backgroundImage: 'radial-gradient(circle at 80% 40%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        padding: '3.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }} className="badge badge-gold">
            <Flame size={14} color="#f59e0b" />
            <span>ETHIOPIAN PREMIER LEAGUE 2026/27</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            THE WAVES OF TANA <br />
            <span className="gradient-text-gold">RIDE TO GLORY</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '540px',
            marginBottom: '2rem'
          }}>
            Experience the thunderous pride of Bahir Dar International Stadium. Secure official matchday e-tickets, grab the authentic 2026/27 jersey kit, and follow live match updates.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={onBuyTickets}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.75rem',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#091c20',
                fontWeight: 800,
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                transition: 'var(--transition)'
              }}
            >
              <Ticket size={18} />
              <span>Book Match Tickets</span>
            </button>

            <button
              onClick={onExploreStore}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <ShoppingBag size={18} color="var(--bdk-accent)" />
              <span>Official Store</span>
            </button>

            <button
              onClick={onViewSquad}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>Meet Squad</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Highlight Stats Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-panel-gold animate-float" style={{
            padding: '2rem',
            width: '100%',
            maxWidth: '380px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--bdk-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                CURRENT FORM • 1ST PLACE
              </span>
              <Trophy size={20} color="var(--bdk-gold)" />
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              53 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600 }}>PTS</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--bdk-accent)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
              Leading Ethiopian Premier League 2026
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>WON</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>16</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>DRAW</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>5</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>GOALS</div>
                <div style={{ color: 'var(--bdk-gold)', fontWeight: 800, fontSize: '1.2rem' }}>+26</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
