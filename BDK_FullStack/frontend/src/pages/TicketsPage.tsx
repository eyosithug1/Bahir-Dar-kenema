import React, { useState } from 'react';
import { Match, TicketTier } from '../types';
import { TicketBookingModal } from '../components/tickets/TicketBookingModal';
import { Ticket, Shield, CheckCircle, MapPin, Sparkles } from 'lucide-react';

interface TicketsPageProps {
  matches: Match[];
  tiers: TicketTier[];
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ matches, tiers }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const upcomingHomeMatches = matches.filter((m) => m.status === 'UPCOMING');

  const handleStartBooking = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Ticket size={24} color="var(--bdk-gold)" />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
            Official Matchday Ticketing
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Instant e-ticket booking with contactless QR turnstile access at Bahir Dar International Stadium. Powered by Telebirr & CBE Birr.
        </p>
      </div>

      {/* Available Fixtures */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
        Select Match Fixture
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {upcomingHomeMatches.map((match) => (
          <div
            key={match.id}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              border: '1px solid var(--border-glow)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span className="badge badge-gold">{match.competition}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{match.round}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
                {match.homeTeam} vs {match.awayTeam}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} color="var(--bdk-gold)" />
                <span>{match.venue} • {match.date} @ {match.time} ET</span>
              </div>
            </div>

            <button
              onClick={() => handleStartBooking(match)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                backgroundColor: 'var(--bdk-secondary)',
                color: '#091c20',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Ticket size={18} />
              <span>Select Seats & Buy</span>
            </button>
          </div>
        ))}
      </div>

      {/* Seating Tiers Breakdown */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
        Stadium Seating Tiers & Amenities
      </h2>

      <div className="grid-responsive-3">
        {tiers.map((tier) => (
          <div key={tier.id} className="glass-panel" style={{ padding: '1.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{tier.name}</h3>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--bdk-gold)' }}>
                {tier.price} <span style={{ fontSize: '0.8rem' }}>ETB</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {tier.description}
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.5rem' }}>
                INCLUDED BENEFITS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                {tier.benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMatch && (
        <TicketBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          match={selectedMatch}
          tiers={tiers}
        />
      )}
    </div>
  );
};
