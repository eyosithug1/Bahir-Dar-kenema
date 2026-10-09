import React, { useState } from 'react';
import { Shield, ShoppingBag, User as UserIcon, Menu, X, Calendar, Users, Newspaper, Ticket, Trophy, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'matches', label: 'Matches & Fixtures', icon: Calendar },
    { id: 'standings', label: 'Table & Standings', icon: Trophy },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'tickets', label: 'Buy Tickets', icon: Ticket, highlight: true },
    { id: 'store', label: 'Official Store', icon: ShoppingBag },
    { id: 'news', label: 'Club News', icon: Newspaper },
    { id: 'admin', label: 'Admin Portal', icon: Sparkles },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(11, 15, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      {/* Top Ticker Bar */}
      <div style={{
        backgroundColor: '#062327',
        borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
        padding: '0.4rem 1rem',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>NEXT MATCH</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Bahir Dar Kenema vs Saint George SC</span>
          <span>• Sunday, Oct 4 • 16:00 ET</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--bdk-gold)', fontWeight: 600 }}>🌊 የጣና ሞገዶች (Waves of Tana)</span>
          <span>📍 Bahir Dar Int'l Stadium</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0a3a40 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bdk-gold)',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            fontWeight: 900,
            fontSize: '1.25rem'
          }}>
            BDK
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 40%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              BAHIR DAR KENEMA
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--bdk-accent)', letterSpacing: '0.08em', fontWeight: 600 }}>
              SPORT CLUB • 1973
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.4rem',
        }} className="desktop-nav">
          <style>{`
            @media (min-width: 992px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive
                    ? '1px solid rgba(245, 158, 11, 0.5)'
                    : link.highlight
                    ? '1px solid rgba(6, 182, 212, 0.4)'
                    : '1px solid transparent',
                  backgroundColor: isActive
                    ? 'rgba(245, 158, 11, 0.12)'
                    : link.highlight
                    ? 'rgba(6, 182, 212, 0.1)'
                    : 'transparent',
                  color: isActive ? 'var(--bdk-gold)' : link.highlight ? 'var(--bdk-accent)' : 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: isActive || link.highlight ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls (Cart & Auth) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.6)'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                onClick={() => setActiveTab('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bdk-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--bdk-gold)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--bdk-gold)' }}>{user.role.toUpperCase()}</span>
                </div>
              </div>
              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.3rem'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--bdk-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: '#091c20',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                transition: 'var(--transition)'
              }}
            >
              <UserIcon size={16} />
              <span>Fan Login</span>
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isActive ? 'var(--bdk-gold)' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
