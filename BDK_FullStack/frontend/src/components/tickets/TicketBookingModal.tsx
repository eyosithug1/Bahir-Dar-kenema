import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Match, TicketTier, MatchTicketBooking } from '../../types';
import { api } from '../../services/api';
import { CheckCircle2, QrCode, Ticket, ShieldCheck } from 'lucide-react';

interface TicketBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  tiers: TicketTier[];
}

export const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  match,
  tiers,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>(tiers[0]?.id || 'tier-regular');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'BOA' | 'Card'>('Telebirr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<MatchTicketBooking | null>(null);

  if (!match) return null;

  const currentTierObj = tiers.find((t) => t.id === selectedTier) || tiers[0];
  const totalPrice = (currentTierObj?.price || 100) * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      const res = await api.bookTicket({
        matchId: match.id,
        tierId: selectedTier,
        quantity,
        customerName,
        customerPhone,
        paymentMethod,
      });
      setConfirmedBooking(res);
    } catch {
      // Offline mock booking generator
      const mockBooking: MatchTicketBooking = {
        id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        matchId: match.id,
        matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
        tierId: currentTierObj.id,
        tierName: currentTierObj.name,
        quantity,
        totalPrice,
        customerName,
        customerPhone,
        customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '')}@fan.bdk.et`,
        paymentMethod,
        status: 'CONFIRMED',
        qrCodeToken: `BDK-QR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        bookedAt: new Date().toISOString(),
      };
      setConfirmedBooking(mockBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setQuantity(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={confirmedBooking ? 'Matchday E-Ticket Confirmation' : `Book Tickets: ${match.homeTeam} vs ${match.awayTeam}`}
      maxWidth="620px"
    >
      {confirmedBooking ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#10b981'
          }}>
            <CheckCircle2 size={32} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Ticket Booked Successfully!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            A confirmation SMS with QR verification link has been sent to {confirmedBooking.customerPhone}.
          </p>

          {/* E-Ticket Display Card */}
          <div style={{
            backgroundColor: '#0a2327',
            border: '2px dashed var(--bdk-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '1.5rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>OFFICIAL E-TICKET</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--bdk-gold)', fontWeight: 700 }}>
                {confirmedBooking.id}
              </span>
            </div>

            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' }}>
              {confirmedBooking.matchTitle}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--bdk-accent)', marginBottom: '1rem' }}>
              Bahir Dar International Stadium • {match.date} • {match.time} ET
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>HOLDER</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>TIER</span>
                <span style={{ color: 'var(--bdk-gold)', fontWeight: 600 }}>{confirmedBooking.tierName}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>QTY & PRICE</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{confirmedBooking.quantity} Seat(s) • {confirmedBooking.totalPrice} ETB</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>PAYMENT</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>{confirmedBooking.paymentMethod} (PAID)</span>
              </div>
            </div>

            {/* QR Verification Placeholder */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-sm)',
              color: '#000'
            }}>
              <QrCode size={36} color="#0a3a40" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                  {confirmedBooking.qrCodeToken}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  Show this QR code at Turnstile Entry Gate
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--bdk-secondary)',
              color: '#000',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tier Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Select Seating Section
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedTier === tier.id ? '2px solid var(--bdk-gold)' : '1px solid var(--border-color)',
                    backgroundColor: selectedTier === tier.id ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: selectedTier === tier.id ? 'var(--bdk-gold)' : '#fff' }}>
                      {tier.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tier.description}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--bdk-gold)' }}>
                      {tier.price} ETB
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>per seat</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Number of Tickets
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setQuantity(num)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    border: quantity === num ? '2px solid var(--bdk-gold)' : '1px solid var(--border-color)',
                    backgroundColor: quantity === num ? 'var(--bdk-secondary)' : 'var(--bg-surface)',
                    color: quantity === num ? '#000' : '#fff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Buyer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dawit Tadesse"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Phone Number (SMS receipt) *
              </label>
              <input
                type="tel"
                required
                placeholder="+251 9..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {(['Telebirr', 'CBE Birr', 'BOA', 'Card'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMethod === method ? '2px solid var(--bdk-gold)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === method ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
                    color: paymentMethod === method ? 'var(--bdk-gold)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary and Action */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount Due</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--bdk-gold)' }}>
                {totalPrice} ETB
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#091c20',
                fontWeight: 800,
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Processing Payment...' : `Pay & Get Ticket`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
