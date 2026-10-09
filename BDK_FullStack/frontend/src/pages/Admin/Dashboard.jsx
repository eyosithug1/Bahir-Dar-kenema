import React, { useEffect, useState } from 'react';
import { orderAPI, productAPI, newsAPI, commentAPI, playerAPI, liveScoreAPI } from '../../services/api';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalNews: 0,
    totalPlayers: 0,
    totalMatches: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        
        // Get all stats
        const [ordersRes, productsRes, newsRes, playersRes, matchesRes] = await Promise.all([
          orderAPI.getAll(),
          productAPI.getAll(),
          newsAPI.getAll(),
          playerAPI.getAll().catch(() => ({ data: { data: [] } })),
          liveScoreAPI.getAll().catch(() => ({ data: { data: [] } }))
        ]);

        // Calculate stats
        const orders = ordersRes.data.data || [];
        const products = productsRes.data.data || [];
        const news = newsRes.data.data || [];
        const players = playersRes.data.data || [];
        const matches = matchesRes.data.data || [];

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalNews: news.length,
          totalPlayers: players.length,
          totalMatches: matches.length
        });

        // Get recent orders
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's your activity overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Products */}
        <div className="card-glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-3xl font-black text-white mt-2">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl">🛍</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card-glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-black text-white mt-2">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="card-glass p-6 rounded-xl border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-3xl font-black text-orange-400 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        {/* News Articles */}
        <div className="card-glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">News Articles</p>
              <p className="text-3xl font-black text-white mt-2">{stats.totalNews}</p>
            </div>
            <div className="text-4xl">📰</div>
          </div>
        </div>

        {/* Squad Players */}
        <div className="card-glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Squad Players</p>
              <p className="text-3xl font-black text-white mt-2">{stats.totalPlayers}</p>
            </div>
            <div className="text-4xl">🏃</div>
          </div>
        </div>

        {/* Fixtures & Matches */}
        <div className="card-glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fixtures</p>
              <p className="text-3xl font-black text-white mt-2">{stats.totalMatches}</p>
            </div>
            <div className="text-4xl">⚽</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-glass p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
        
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="px-4 py-4 font-mono text-sm text-bdk-accent">
                      {order.orderNumber?.slice(0, 10)}...
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {order.customerPhone}
                    </td>
                    <td className="px-4 py-4 font-bold text-bdk-accent">
                      {order.totalPrice} Br
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/admin/products" className="card-glass p-6 rounded-xl hover:bg-white/15 transition-all">
          <p className="text-lg font-bold text-white mb-2">Manage Products</p>
          <p className="text-gray-400 text-sm">Add, edit, or delete products</p>
        </a>
        
        <a href="/admin/news" className="card-glass p-6 rounded-xl hover:bg-white/15 transition-all">
          <p className="text-lg font-bold text-white mb-2">Post News</p>
          <p className="text-gray-400 text-sm">Create new articles and updates</p>
        </a>

        <a href="/admin/orders" className="card-glass p-6 rounded-xl hover:bg-white/15 transition-all">
          <p className="text-lg font-bold text-white mb-2">View All Orders</p>
          <p className="text-gray-400 text-sm">Manage customer orders</p>
        </a>

        <a href="/admin/live-scores" className="card-glass p-6 rounded-xl hover:bg-white/15 transition-all">
          <p className="text-lg font-bold text-white mb-2">Update Scores</p>
          <p className="text-gray-400 text-sm">Update match scores and results</p>
        </a>
      </div>
    </div>
  );
}

export default AdminDashboard;
