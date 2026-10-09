import React from 'react';
import { Shield, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  return (
    <footer style={{
      backgroundColor: '#070b11',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem',
      marginTop: '5rem'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Col 1: Club Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0a3a40 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--bdk-gold)',
              color: '#fbbf24',
              fontWeight: 800
            }}>
              BDK
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Bahir Dar Kenema FC</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--bdk-accent)' }}>የጣና ሞገዶች • Waves of Tana</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Official digital platform for Bahir Dar Kenema Sport Club. Competing at the pinnacle of the BetKing Ethiopian Premier League and CAF Continental Tournaments.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-gold">EPL Contender</span>
            <span className="badge badge-blue">Est. 1973</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>Club Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['Matches & Fixtures', 'Squad Roster', 'League Standings', 'Matchday Tickets', 'Official Store', 'Club News'].map((item) => {
              const tabMap: Record<string, string> = {
                'Matches & Fixtures': 'matches',
                'Squad Roster': 'squad',
                'League Standings': 'standings',
                'Matchday Tickets': 'tickets',
                'Official Store': 'store',
                'Club News': 'news',
              };
              return (
                <li key={item}>
                  <button
                    onClick={() => setActiveTab(tabMap[item] || 'home')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'color 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--bdk-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Col 3: Stadium & Contact */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>Headquarters & Stadium</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <MapPin size={18} color="var(--bdk-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Bahir Dar International Stadium, Lake Tana Waterfront, Bahir Dar, Amhara, Ethiopia</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Phone size={18} color="var(--bdk-accent)" />
              <span>+251 58 220 1973 / +251 918 000 111</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Mail size={18} color="var(--bdk-gold)" />
              <span>info@bahirdarkenemafc.et</span>
            </div>
          </div>
        </div>

        {/* Col 4: Digital Membership & Fan Club */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>Waves Fan Club</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            Join over 100,000 registered supporters worldwide. Get priority matchday access, member merchandise discounts, and live SMS updates.
          </p>
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(10, 58, 64, 0.4)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--bdk-gold)'
          }}>
            🌟 Official Digital Ticketing Partner: Telebirr & CBE Birr Integrated
          </div>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <div>
          © 2026 Bahir Dar Kenema Sport Club. All Rights Reserved. Built with pride for the Waves of Tana.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Ethiopian Football Fans
        </div>
      </div>
    </footer>
  );
};
