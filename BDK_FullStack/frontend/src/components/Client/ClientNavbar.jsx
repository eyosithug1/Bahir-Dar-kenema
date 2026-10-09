import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { useLanguage } from '../../context/LanguageContext';

function ClientNavbar() {
  const { user, logout } = useAuthStore();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <nav className="bg-bdk-primary border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl font-black text-bdk-accent">BDK</span>
            <span className="text-sm font-bold text-bdk-light hidden sm:block leading-tight">
              {language === 'am' ? 'ባህር ዳር' : 'Bahir Dar'}<br />
              {language === 'am' ? 'ከነማ እግር ኳስ' : 'Kenema FC'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white hover:text-bdk-accent transition-colors font-medium">
              {t('home')}
            </Link>
            <Link to="/matches" className="text-white hover:text-bdk-accent transition-colors font-medium">
              {t('matches')}
            </Link>
            <Link to="/squad" className="text-white hover:text-bdk-accent transition-colors font-medium">
              {t('squad')}
            </Link>
            <Link to="/news" className="text-white hover:text-bdk-accent transition-colors font-medium">
              {t('news')}
            </Link>
            <Link to="/shop" className="text-white hover:text-bdk-accent transition-colors font-medium">
              {t('shop')}
            </Link>
            <Link to="/fan-wall" className="text-white hover:text-bdk-accent transition-colors font-medium">
              {t('fanWall')}
            </Link>
          </div>

          {/* Right Side - Language Switcher & User Menu */}
          <div className="flex items-center gap-3">
            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 shadow-sm"
              title="Toggle Language"
            >
              <span className="text-base">{language === 'en' ? '🇪🇹' : '🇬🇧'}</span>
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            {/* Admin Quick Button */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-bdk-dark font-black text-xs transition shadow-md flex items-center gap-1.5"
                title="Open Admin Management Panel"
              >
                <span>⚙</span>
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 bg-bdk-accent text-bdk-dark rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                  </div>
                  <span className="hidden sm:block text-white text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bdk-dark border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-yellow-300 font-bold hover:bg-white/10 transition-all border-b border-white/10 text-xs flex items-center gap-2"
                      >
                        <span>⚙</span>
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-all text-xs"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-all text-xs"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black text-xs transition shadow-md"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('home')}
            </Link>
            <Link
              to="/matches"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('matches')}
            </Link>
            <Link
              to="/squad"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('squad')}
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('news')}
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('shop')}
            </Link>
            <Link
              to="/fan-wall"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('fanWall')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ClientNavbar;
