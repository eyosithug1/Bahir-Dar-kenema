import React, { useEffect, useState } from 'react';
import { liveScoreAPI, ticketAPI } from '../../services/api';
import { useAuthStore } from '../../context/authStore';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function ClientMatches() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, finished
  const [selectedMatchForTicket, setSelectedMatchForTicket] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState('Regular');
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const res = await liveScoreAPI.getAll();
      setMatches(res.data.data || []);
    } catch {
      toast.error('Failed to load match schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book match tickets');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await ticketAPI.bookTicket({
        matchId: selectedMatchForTicket._id,
        tierName: selectedTier,
        quantity: ticketQuantity,
        paymentMethod
      });
      setBookingSuccess(res.data.data);
      toast.success('Ticket booking confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book ticket');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter === 'upcoming') return m.status === 'upcoming' || m.status === 'live';
    if (filter === 'finished') return m.status === 'finished';
    return true;
  });

  const getTierPrice = (tier) => {
    if (tier === 'VIP') return 500;
    if (tier === 'Student') return 80;
    return 150;
  };

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-bdk-accent/10 border border-bdk-accent/30 rounded-full text-bdk-accent text-xs font-bold uppercase tracking-wider mb-3">
          ⚽ Ethiopian Premier League
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Fixtures & Match Results
        </h1>
        <p className="text-gray-300 mt-2">
          Support Bahir Dar Kenema at the stadium or follow live scores and post-match statistics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {[
          { id: 'all', label: 'All Matches' },
          { id: 'upcoming', label: 'Upcoming Fixtures' },
          { id: 'finished', label: 'Past Results' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              filter === tab.id
                ? 'bg-bdk-accent text-bdk-dark shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Match Cards List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner"></div></div>
      ) : filteredMatches.length === 0 ? (
        <div className="card-glass p-12 text-center text-gray-400 rounded-2xl">
          No matches found for this selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMatches.map(match => {
            const isFinished = match.status === 'finished';
            const isLive = match.status === 'live';
            const matchDate = new Date(match.matchDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={match._id}
                className="card-glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-bdk-accent/40 transition flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Match Info & Teams */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-bdk-accent uppercase bg-bdk-accent/10 px-3 py-1 rounded-full border border-bdk-accent/20">
                      {match.competition || 'Ethiopian Premier League'}
                    </span>
                    <span className="text-xs text-gray-400">
                      📍 {match.venue || 'Bahir Dar Stadium'} • {matchDate} at {match.matchTime || '16:00'}
                    </span>
                    {isLive && (
                      <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>

                  {/* Team vs Team Header */}
                  <div className="grid grid-cols-3 items-center text-center max-w-xl">
                    <div className="text-right">
                      <h3 className={`text-lg md:text-xl font-black ${match.homeTeam.includes('Bahir') ? 'text-bdk-accent' : 'text-white'}`}>
                        {match.homeTeam}
                      </h3>
                      <p className="text-xs text-gray-400">Home</p>
                    </div>

                    <div className="px-4">
                      {isFinished || isLive ? (
                        <div className="text-3xl md:text-4xl font-black text-white bg-black/40 py-2 px-4 rounded-xl border border-white/10 inline-block font-mono">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-bdk-light bg-white/5 py-1.5 px-3 rounded-lg border border-white/10 inline-block">
                          VS
                        </div>
                      )}
                    </div>

                    <div className="text-left">
                      <h3 className={`text-lg md:text-xl font-black ${match.awayTeam.includes('Bahir') ? 'text-bdk-accent' : 'text-white'}`}>
                        {match.awayTeam}
                      </h3>
                      <p className="text-xs text-gray-400">Away</p>
                    </div>
                  </div>

                  {/* Stats snippet for finished matches */}
                  {match.statistics?.possession && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-6 text-xs text-gray-400">
                      <div>Possession: <span className="font-bold text-white">{match.statistics.possession.home}% - {match.statistics.possession.away}%</span></div>
                      {match.statistics.shots && (
                        <div>Shots: <span className="font-bold text-white">{match.statistics.shots.home} - {match.statistics.shots.away}</span></div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  {!isFinished ? (
                    <button
                      onClick={() => {
                        setSelectedMatchForTicket(match);
                        setBookingSuccess(null);
                      }}
                      className="px-6 py-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl transition shadow-lg text-center"
                    >
                      🎟️ Book Stadium Tickets
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-white/5 text-gray-400 font-bold text-xs rounded-xl border border-white/10 text-center">
                      Match Concluded
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Booking Modal */}
      {selectedMatchForTicket && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark max-w-lg w-full p-6 md:p-8 rounded-2xl border border-white/20">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black border border-emerald-500/30">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">Tickets Confirmed!</h3>
                <p className="text-gray-300 text-sm">
                  Show your digital pass or reference code at Bahir Dar International Stadium gate.
                </p>

                <div className="bg-white/5 p-4 rounded-xl text-left text-sm space-y-2 border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking Ref:</span>
                    <span className="font-mono font-bold text-bdk-accent">{bookingSuccess.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tier:</span>
                    <span className="font-bold text-white">{bookingSuccess.tierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="font-bold text-white">{bookingSuccess.quantity} Tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Paid:</span>
                    <span className="font-bold text-emerald-400">{bookingSuccess.totalAmount} ETB</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMatchForTicket(null);
                    setBookingSuccess(null);
                  }}
                  className="w-full py-3 bg-bdk-accent text-bdk-dark font-black rounded-xl hover:bg-yellow-400 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Book Match Tickets
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedMatchForTicket.homeTeam} vs {selectedMatchForTicket.awayTeam}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMatchForTicket(null)}
                    className="text-gray-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleBookTicket} className="space-y-4">
                  {/* Tier select */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">
                      Select Ticket Category
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { tier: 'Regular', price: 150, desc: 'Covered stand' },
                        { tier: 'VIP', price: 500, desc: 'Tribune & Lounge' },
                        { tier: 'Student', price: 80, desc: 'East Terrace' }
                      ].map(item => (
                        <div
                          key={item.tier}
                          onClick={() => setSelectedTier(item.tier)}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                            selectedTier === item.tier
                              ? 'border-bdk-accent bg-bdk-accent/10 text-white'
                              : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="font-bold text-sm">{item.tier}</div>
                          <div className="text-bdk-accent font-black text-xs my-1">{item.price} ETB</div>
                          <div className="text-[10px] text-gray-400">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-between items-center py-2 border-y border-white/10">
                    <span className="text-sm font-semibold text-gray-300">Number of Tickets</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-white font-mono">{ticketQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['telebirr', 'chapa'].map(method => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition ${
                            paymentMethod === method
                              ? 'border-bdk-accent bg-bdk-accent text-bdk-dark'
                              : 'border-white/10 bg-white/5 text-gray-300'
                          }`}
                        >
                          {method === 'telebirr' ? '📱 Telebirr' : '💳 Card / CBE'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-300 font-semibold">Total Price:</span>
                    <span className="text-xl font-black text-bdk-accent font-mono">
                      {getTierPrice(selectedTier) * ticketQuantity} ETB
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMatchForTicket(null)}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 py-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl transition text-sm"
                    >
                      {bookingLoading ? 'Processing...' : 'Confirm & Pay'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
      <ClientFooter />
    </div>
  );
}

export default ClientMatches;
