import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminDemo, setIsAdminDemo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const targetEmail = isAdminDemo ? 'admin@bdk.et' : email || 'fan@bdk.et';
    try {
      await login(targetEmail);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const setDemoAdmin = () => {
    setEmail('admin@bdk.et');
    setPassword('admin123');
    setIsAdminDemo(true);
  };

  const setDemoFan = () => {
    setEmail('yonas.fan@bdk.et');
    setPassword('fan123');
    setIsAdminDemo(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fan Club & Club Portal Access" maxWidth="450px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Sign in to view your matchday bookings, store order history, and access digital membership perks.
        </p>

        {/* Quick Demo Fill Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={setDemoFan}
            style={{
              padding: '0.5rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--bdk-accent)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Demo: Fan Account
          </button>
          <button
            type="button"
            onClick={setDemoAdmin}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid var(--border-glow)',
              color: 'var(--bdk-gold)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Demo: Admin Portal
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              placeholder="e.g. fan@bdk.et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
            <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
            <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--bdk-secondary)',
            color: '#091c20',
            fontWeight: 800,
            fontSize: '0.95rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </Modal>
  );
};
