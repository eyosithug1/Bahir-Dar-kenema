import React, { useState } from 'react';
import { useAuthStore } from '../../context/authStore';
import { useNavigate } from 'react-router-dom';

function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-bdk-primary border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="text-white hover:bg-white/10 p-2 rounded-lg lg:hidden"
      >
        ☰
      </button>

      {/* Center - Title */}
      <h2 className="text-xl font-bold text-white hidden md:block">Admin Dashboard</h2>

      {/* Right - User Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
        >
          <div className="w-8 h-8 bg-bdk-accent text-bdk-dark rounded-full flex items-center justify-center font-bold text-sm">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-300">{user?.role}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-bdk-dark border border-white/10 rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-white/10">
              <p className="text-sm text-gray-300">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            
            <button
              onClick={() => {
                handleLogout();
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNavbar;
