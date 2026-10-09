import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '▦' },
    { path: '/admin/hero-carousel', label: 'Hero Carousel', icon: '🎠' },
    { path: '/admin/news', label: 'News', icon: '📰' },
    { path: '/admin/products', label: 'Products', icon: '🛍' },
    { path: '/admin/orders', label: 'Store Orders', icon: '📦' },
    { path: '/admin/tickets', label: 'Stadium Tickets', icon: '🎟️' },
    { path: '/admin/live-scores', label: 'Live Scores', icon: '⚽' },
    { path: '/admin/players', label: 'Squad Players', icon: '🏃' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/comments', label: 'Comments', icon: '💬' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-bdk-dark border-r border-white/10 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black text-bdk-accent">BDK</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-bdk-accent text-bdk-dark font-bold'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-bdk-dark/50 text-xs text-gray-400">
          <p>v1.0.0</p>
          <p>BDK Football Club</p>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
