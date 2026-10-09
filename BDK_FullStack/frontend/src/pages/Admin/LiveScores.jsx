import React, { useEffect, useState } from 'react';
import { liveScoreAPI } from '../../services/api';
import toast from 'react-hot-toast';

const emptyForm = {
  homeTeam: 'Bahir Dar Kenema',
  awayTeam: '',
  homeScore: 0,
  awayScore: 0,
  matchDate: '',
  matchTime: '16:00',
  venue: 'Bahir Dar International Stadium',
  competition: 'Ethiopian Premier League',
  status: 'upcoming'
};

const STATUS_STYLES = {
  live:      'bg-red-500 text-white animate-pulse',
  upcoming:  'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  finished:  'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

function AdminLiveScores() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMatch, setEditMatch] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const res = await liveScoreAPI.getAll();
      setMatches(res.data.data || []);
    } catch {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditMatch(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (match) => {
    setEditMatch(match);
    const d = match.matchDate ? new Date(match.matchDate).toISOString().split('T')[0] : '';
    setFormData({
      homeTeam: match.homeTeam || 'Bahir Dar Kenema',
      awayTeam: match.awayTeam || '',
      homeScore: match.homeScore ?? 0,
      awayScore: match.awayScore ?? 0,
      matchDate: d,
      matchTime: match.matchTime || '16:00',
      venue: match.venue || 'Bahir Dar International Stadium',
      competition: match.competition || 'Ethiopian Premier League',
      status: match.status || 'upcoming'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this match fixture?')) return;
    try {
      await liveScoreAPI.delete(id);
      toast.success('Match deleted');
      loadMatches();
    } catch {
      toast.error('Failed to delete match');
    }
  };

  const handleQuickScore = async (match, home, away) => {
    try {
      await liveScoreAPI.updateScore(match._id, { homeScore: home, awayScore: away, status: 'live' });
      toast.success('Score updated!');
      loadMatches();
    } catch {
      toast.error('Failed to update score');
    }
  };

  const handleStatusChange = async (match, status) => {
    try {
      await liveScoreAPI.update(match._id, { ...match, status });
      toast.success('Match status updated!');
      loadMatches();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.awayTeam || !formData.matchDate) {
      toast.error('Away team and match date are required');
      return;
    }
    try {
      setSubmitting(true);
      if (editMatch) {
        await liveScoreAPI.update(editMatch._id, formData);
        toast.success('Match updated!');
      } else {
        await liveScoreAPI.create(formData);
        toast.success('Match created!');
      }
      setShowModal(false);
      loadMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save match');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filterStatus === 'all' ? matches : matches.filter(m => m.status === filterStatus);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Match Fixtures & Live Scores</h1>
          <p className="text-gray-400 text-sm mt-1">Manage fixtures, update live scores and results</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-black">
          + Add Fixture
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'live', 'upcoming', 'finished'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition ${filterStatus === s ? 'bg-bdk-accent text-bdk-dark' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>
            {s === 'live' ? '🔴 Live' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} matches</span>
      </div>

      {/* Match Cards */}
      {loading ? (
        <div className="flex justify-center h-48 items-center"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <p className="text-3xl mb-2">⚽</p>
          <p className="text-gray-400">No {filterStatus === 'all' ? '' : filterStatus} matches found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(match => (
            <div key={match._id} className="card-glass p-5 rounded-2xl border border-white/10 hover:border-white/20 transition">
              {/* Status + Competition */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400">{match.competition}</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[match.status] || STATUS_STYLES.upcoming}`}>
                  {match.status}
                </span>
              </div>

              {/* Teams & Score */}
              <div className="flex items-center justify-between gap-4 my-4">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-xl bg-bdk-accent text-bdk-dark font-black flex items-center justify-center text-sm mx-auto mb-1">BDK</div>
                  <p className="font-bold text-white text-sm leading-tight">{match.homeTeam}</p>
                </div>
                <div className="text-center">
                  {match.status === 'upcoming' ? (
                    <div>
                      <div className="text-2xl font-black text-gray-400">VS</div>
                      <div className="text-xs text-bdk-accent font-bold mt-1">
                        {match.matchDate ? new Date(match.matchDate).toLocaleDateString('en-ET', { month: 'short', day: 'numeric' }) : '—'}
                        {match.matchTime && ` • ${match.matchTime}`}
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-black text-white">
                      {match.homeScore ?? 0} <span className="text-bdk-accent">:</span> {match.awayScore ?? 0}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/10 text-white font-black flex items-center justify-center text-lg mx-auto mb-1">⚽</div>
                  <p className="font-bold text-white text-sm leading-tight">{match.awayTeam}</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center mb-4">
                📍 {match.venue}
              </div>

              {/* Quick Score (Live / Upcoming -> Live) */}
              {(match.status === 'live' || match.status === 'upcoming') && (
                <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/5">
                  <span className="text-xs text-gray-400 font-bold">Score:</span>
                  <button onClick={() => handleQuickScore(match, (match.homeScore || 0) + 1, match.awayScore || 0)}
                    className="px-2 py-1 bg-bdk-accent/20 hover:bg-bdk-accent/30 text-bdk-accent rounded text-xs font-black">
                    BDK +1
                  </button>
                  <button onClick={() => handleQuickScore(match, match.homeScore || 0, (match.awayScore || 0) + 1)}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-black">
                    OPP +1
                  </button>
                  <select onChange={e => handleStatusChange(match, e.target.value)} value={match.status}
                    className="ml-auto bg-bdk-dark border border-white/10 text-xs text-gray-300 px-2 py-1 rounded">
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => openEdit(match)} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition">Edit</button>
                <button onClick={() => handleDelete(match._id)} className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass border border-bdk-accent/30 rounded-2xl w-full max-w-lg p-6 relative bg-bdk-dark">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
            <h2 className="text-2xl font-black text-white mb-4">{editMatch ? 'Edit Fixture' : 'Add New Fixture'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Home Team</label>
                  <input type="text" value={formData.homeTeam} onChange={e => setFormData(p => ({ ...p, homeTeam: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Away Team *</label>
                  <input type="text" required placeholder="e.g. Saint George SC" value={formData.awayTeam}
                    onChange={e => setFormData(p => ({ ...p, awayTeam: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Home Score</label>
                  <input type="number" min="0" value={formData.homeScore}
                    onChange={e => setFormData(p => ({ ...p, homeScore: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Away Score</label>
                  <input type="number" min="0" value={formData.awayScore}
                    onChange={e => setFormData(p => ({ ...p, awayScore: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Match Date *</label>
                  <input type="date" required value={formData.matchDate}
                    onChange={e => setFormData(p => ({ ...p, matchDate: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Kick-off Time</label>
                  <input type="time" value={formData.matchTime}
                    onChange={e => setFormData(p => ({ ...p, matchTime: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Venue</label>
                <input type="text" value={formData.venue}
                  onChange={e => setFormData(p => ({ ...p, venue: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Competition</label>
                  <input type="text" value={formData.competition}
                    onChange={e => setFormData(p => ({ ...p, competition: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-bdk-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent">
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl text-sm disabled:opacity-50">
                  {submitting ? 'Saving...' : editMatch ? 'Update Match' : 'Create Fixture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLiveScores;
