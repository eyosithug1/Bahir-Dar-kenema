import React, { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAllUsers();
      setUsers(res.data.data || []);
    } catch {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      await userAPI.updateRole(userId, newRole);
      toast.success(`User role changed to ${newRole}`);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const handleBanToggle = async (userId, isActive) => {
    const action = isActive ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

    try {
      await userAPI.toggleBan(userId);
      toast.success(`Account ${action}d successfully`);
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
    } catch {
      toast.error('Failed to update account status');
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage accounts, change roles & toggle access permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-bdk-accent bg-bdk-accent/10 px-3 py-1.5 rounded-lg border border-bdk-accent/20">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto">
          {['all', 'admin', 'client'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${
                filterRole === r
                  ? 'bg-bdk-accent text-bdk-dark'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
        />
      </div>

      {/* Users Table */}
      <div className="card-glass rounded-2xl overflow-hidden border border-white/10">
        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No users found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(user => {
                  const isActive = user.isActive !== false;
                  return (
                    <tr key={user._id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-bdk-primary border border-bdk-accent/30 text-bdk-accent font-black flex items-center justify-center text-xs">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                        {user.phone || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleRoleToggle(user._id, user.role)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium transition"
                        >
                          Make {user.role === 'admin' ? 'Client' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleBanToggle(user._id, isActive)}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${
                            isActive
                              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          }`}
                        >
                          {isActive ? 'Ban / Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
