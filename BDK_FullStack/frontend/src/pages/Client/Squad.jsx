import React, { useEffect, useState } from 'react';
import { playerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function ClientSquad() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

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

  const filteredPlayers = selectedRole === 'ALL'
    ? players
    : players.filter(p => p.role === selectedRole || p.position === selectedRole);

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-bdk-accent uppercase bg-bdk-accent/10 px-3.5 py-1.5 rounded-full border border-bdk-accent/20 tracking-widest">
          First Team Squad 2024/25
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-3 tracking-tight font-heading">
          The Waves of Lake Tana
        </h1>
        <p className="text-blue-200 text-sm md:text-base leading-relaxed">
          Meet the 32+ professional athletes representing Bahir Dar Kenema Football Club in the Ethiopian Premier League.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {[
          { id: 'ALL', label: 'All Squad' },
          { id: 'GK', label: 'Goalkeepers' },
          { id: 'DF', label: 'Defenders' },
          { id: 'MF', label: 'Midfielders' },
          { id: 'FW', label: 'Forwards' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition ${
              selectedRole === tab.id
                ? 'bg-bdk-accent text-bdk-dark shadow-lg shadow-yellow-400/20'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24"><div className="spinner"></div></div>
      ) : filteredPlayers.length === 0 ? (
        <div className="card-glass p-12 text-center text-gray-400 rounded-2xl">
          No players found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map(player => (
            <div
              key={player._id}
              onClick={() => setSelectedPlayer(player)}
              className="card-glass rounded-2xl p-4 border border-white/10 hover:border-bdk-accent/50 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-4 overflow-hidden rounded-xl bg-bdk-dark/50 aspect-square flex items-center justify-center">
                  <img
                    src={player.photo || '/BDK_asset/club team squad/images (43).jpeg'}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.src = '/BDK_asset/club team squad/images (43).jpeg'; }}
                  />
                  <span className="absolute top-3 left-3 bg-bdk-primary/90 text-bdk-accent font-black text-sm px-2.5 py-1 rounded-md border border-white/10">
                    #{player.number}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {player.role || player.position}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-bdk-accent transition truncate">
                  {player.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                  <span>{player.country} • {player.age} yrs</span>
                  <span className="text-bdk-light font-semibold">{player.position}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                <span>View Full Profile</span>
                <span className="text-bdk-accent font-bold group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark max-w-md w-full p-6 rounded-2xl border border-white/20 relative animate-fade-in">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-bdk-accent/50 mb-3 shadow-xl">
                <img
                  src={selectedPlayer.photo || '/BDK_asset/club team squad/images (43).jpeg'}
                  alt={selectedPlayer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-black text-white">{selectedPlayer.name}</h2>
              <p className="text-bdk-accent text-sm font-bold uppercase mt-1">
                #{selectedPlayer.number} • {selectedPlayer.position}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
              <div><span className="text-gray-400">Nationality:</span> <strong className="text-white ml-1">{selectedPlayer.country}</strong></div>
              <div><span className="text-gray-400">Age:</span> <strong className="text-white ml-1">{selectedPlayer.age} years</strong></div>
              <div><span className="text-gray-400">Height:</span> <strong className="text-white ml-1">{selectedPlayer.height || '1.82m'}</strong></div>
              <div><span className="text-gray-400">Weight:</span> <strong className="text-white ml-1">{selectedPlayer.weight || '76kg'}</strong></div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Season Performance</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="block text-gray-400 text-[10px]">APPEARANCES</span>
                  <span className="font-bold text-white text-base">{selectedPlayer.stats?.appearances || 0}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="block text-gray-400 text-[10px]">GOALS</span>
                  <span className="font-bold text-bdk-accent text-base">{selectedPlayer.stats?.goals || 0}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="block text-gray-400 text-[10px]">ASSISTS</span>
                  <span className="font-bold text-blue-300 text-base">{selectedPlayer.stats?.assists || 0}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlayer(null)}
              className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
      <ClientFooter />
    </div>
  );
}

export default ClientSquad;
