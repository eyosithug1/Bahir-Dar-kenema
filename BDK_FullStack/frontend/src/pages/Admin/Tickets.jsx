import React, { useEffect, useState } from 'react';
import { ticketAPI } from '../../services/api';
import toast from 'react-hot-toast';

function AdminTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await ticketAPI.getAllBookings();
      setBookings(res.data.data || []);
    } catch {
      toast.error('Failed to load ticket bookings');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchCust = b.customerName?.toLowerCase().includes(q) || b.customerPhone?.includes(q);
    const matchRef = b.bookingReference?.toLowerCase().includes(q);
    const matchTier = filterTier === 'ALL' || b.tierName?.toUpperCase() === filterTier;
    return (matchCust || matchRef) && matchTier;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + (b.quantity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Stadium Ticket Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage digital gate passes, verify references & track match-day tribune revenue
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right">
            <span className="block text-[10px] text-gray-400 uppercase font-bold">Total Revenue</span>
            <span className="font-mono font-black text-lg text-emerald-400">{totalRevenue.toLocaleString()} ETB</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right">
            <span className="block text-[10px] text-gray-400 uppercase font-bold">Total Sold</span>
            <span className="font-mono font-black text-lg text-bdk-accent">{totalTickets} Passes</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto">
          {['ALL', 'VIP', 'REGULAR', 'STUDENT'].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${
                filterTier === tier
                  ? 'bg-bdk-accent text-bdk-dark'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by fan name, phone or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
        />
      </div>

      {/* Bookings Table */}
      <div className="card-glass rounded-2xl overflow-hidden border border-white/10">
        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No ticket bookings found matching this criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Match</th>
                  <th className="px-6 py-4">Fan Details</th>
                  <th className="px-6 py-4">Tier & Qty</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(b => (
                  <tr key={b._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-bdk-accent text-xs">
                        {b.bookingReference}
                      </span>
                      <span className="block text-[10px] text-gray-400 uppercase">{b.paymentMethod || 'telebirr'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white text-xs block">
                        {b.match?.homeTeam || 'Bahir Dar Kenema'} vs {b.match?.awayTeam || 'Opponent'}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {b.match?.venue || 'Bahir Dar Stadium'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-xs">{b.customerName}</div>
                      <div className="text-gray-400 text-xs">{b.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        b.tierName === 'VIP' ? 'bg-purple-500/20 text-purple-300' :
                        b.tierName === 'Student' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {b.tierName}
                      </span>
                      <span className="text-gray-300 ml-2 font-bold text-xs">{b.quantity}x</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400 text-xs">
                      {b.totalAmount} ETB
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                        {b.status || 'CONFIRMED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTickets;
