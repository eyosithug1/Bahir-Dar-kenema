import React, { useEffect, useState } from 'react';
import { playerAPI } from '../../services/api';
import ImageUploader from '../../components/Admin/ImageUploader';
import toast from 'react-hot-toast';

const emptyPlayer = {
  name: '',
  number: '',
  position: 'Forward',
  role: 'FW',
  country: 'Ethiopia',
  age: 24,
  height: '1.80m',
  weight: '75kg',
  photo: '/BDK_asset/club team squad/images (43).jpeg',
  bio: '',
  stats: {
    appearances: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0
  }
};

const POSITION_ROLES = {
  Goalkeeper: 'GK',
  Defender: 'DF',
  Midfielder: 'MF',
  Forward: 'FW'
};

function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);
  const [formData, setFormData] = useState(emptyPlayer);
  const [submitting, setSubmitting] = useState(false);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const res = await playerAPI.getAll();
      setPlayers(res.data.data || []);
    } catch {
      toast.error('Failed to load squad members');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditPlayer(null);
    setFormData(emptyPlayer);
    setShowModal(true);
  };

  const openEdit = (player) => {
    setEditPlayer(player);
    setFormData({
      name: player.name || '',
      number: player.number || '',
      position: player.position || 'Forward',
      role: player.role || 'FW',
      country: player.country || 'Ethiopia',
      age: player.age || 24,
      height: player.height || '1.80m',
      weight: player.weight || '75kg',
      photo: player.photo || '/BDK_asset/club team squad/images (43).jpeg',
      bio: player.bio || '',
      stats: player.stats || { appearances: 0, goals: 0, assists: 0, cleanSheets: 0 }
    });
    setShowModal(true);
  };

  const handlePositionChange = (e) => {
    const pos = e.target.value;
    setFormData(prev => ({
      ...prev,
      position: pos,
      role: POSITION_ROLES[pos] || 'FW'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.number) {
      toast.error('Name and shirt number are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editPlayer) {
        await playerAPI.update(editPlayer._id, formData);
        toast.success('Player updated successfully');
      } else {
        await playerAPI.create(formData);
        toast.success('Player added to squad');
      }
      setShowModal(false);
      loadPlayers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save player');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the squad?`)) return;
    try {
      await playerAPI.delete(id);
      toast.success('Player removed');
      setPlayers(prev => prev.filter(p => p._id !== id));
    } catch {
      toast.error('Failed to remove player');
    }
  };

  const filteredPlayers = filterRole === 'ALL'
    ? players
    : players.filter(p => p.role === filterRole || p.position === filterRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Squad & Players</h1>
          <p className="text-gray-400 text-sm mt-1">Manage 32+ professional players, statistics & assignments</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-bdk-accent text-bdk-dark font-black rounded-xl hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg"
        >
          <span>+ Add New Player</span>
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'GK', 'DF', 'MF', 'FW'].map(role => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              filterRole === role
                ? 'bg-bdk-accent text-bdk-dark'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {role === 'ALL' ? 'All Positions' : role}
          </button>
        ))}
      </div>

      {/* Player Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner"></div></div>
      ) : filteredPlayers.length === 0 ? (
        <div className="card-glass p-12 text-center text-gray-400 rounded-2xl">
          No players found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map(player => (
            <div key={player._id} className="card-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-bdk-accent/50 transition group">
              <div>
                <div className="relative mb-4 overflow-hidden rounded-xl bg-bdk-dark/50 aspect-square flex items-center justify-center">
                  <img
                    src={player.photo || '/BDK_asset/club team squad/images (43).jpeg'}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => { e.target.src = '/BDK_asset/club team squad/images (43).jpeg'; }}
                  />
                  <span className="absolute top-3 left-3 bg-bdk-primary/90 text-bdk-accent font-black text-sm px-2.5 py-1 rounded-md border border-white/10">
                    #{player.number}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    {player.role || player.position}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-bdk-accent transition truncate">
                  {player.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>{player.country} • {player.age} yrs</span>
                  <span>{player.position}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-xs">
                  <div className="bg-white/5 rounded p-1.5">
                    <span className="block text-gray-400 text-[10px]">APPS</span>
                    <span className="font-bold text-white">{player.stats?.appearances || 0}</span>
                  </div>
                  <div className="bg-white/5 rounded p-1.5">
                    <span className="block text-gray-400 text-[10px]">GOALS</span>
                    <span className="font-bold text-bdk-accent">{player.stats?.goals || 0}</span>
                  </div>
                  <div className="bg-white/5 rounded p-1.5">
                    <span className="block text-gray-400 text-[10px]">AST</span>
                    <span className="font-bold text-blue-300">{player.stats?.assists || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5 pt-3 border-t border-white/10">
                <button
                  onClick={() => openEdit(player)}
                  className="flex-1 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-semibold text-xs rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(player._id, player.name)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 font-semibold text-xs rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark max-w-lg w-full p-6 rounded-2xl max-h-[90vh] overflow-y-auto border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">
              {editPlayer ? `Edit Player: ${editPlayer.name}` : 'Add New Squad Player'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Player Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g. Pape N'Diaye"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Shirt Number</label>
                  <input
                    type="number"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="e.g. 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Position</label>
                  <select
                    value={formData.position}
                    onChange={handlePositionChange}
                    className="w-full bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Country / Nationality</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Ethiopia, Senegal, Ghana..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Height</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="1.85m"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="78kg"
                  />
                </div>
              </div>

              {/* Player Photo Uploader */}
              <ImageUploader
                value={formData.photo}
                onChange={(img) => setFormData({ ...formData, photo: img })}
                label="Player Photo"
                fallback="/BDK_asset/club team squad/images (43).jpeg"
              />

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Appearances</label>
                  <input
                    type="number"
                    value={formData.stats.appearances}
                    onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, appearances: Number(e.target.value) } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Goals</label>
                  <input
                    type="number"
                    value={formData.stats.goals}
                    onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, goals: Number(e.target.value) } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Assists</label>
                  <input
                    type="number"
                    value={formData.stats.assists}
                    onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, assists: Number(e.target.value) } })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-bold text-sm rounded-lg"
                >
                  {submitting ? 'Saving...' : (editPlayer ? 'Update Player' : 'Create Player')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPlayers;
