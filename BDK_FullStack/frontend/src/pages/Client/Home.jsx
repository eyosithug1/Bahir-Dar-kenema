import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { playerAPI, productAPI, liveScoreAPI, newsAPI, commentAPI, orderAPI } from '../../services/api';
import { squadData as fallbackSquad, shopItems as fallbackShop, galleryData, faqData, coachingStaff } from '../../data/bdkData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuthStore } from '../../context/authStore';
import toast from 'react-hot-toast';
import HeroEventCarousel from '../../components/Client/HeroEventCarousel';

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('show'); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ====== NAVBAR ======
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuthStore();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  const navLinks = [
    { hash: '#home', path: '/', label: t('home') },
    { hash: '#matches', path: '/matches', label: t('matches') },
    { hash: '#squad', path: '/squad', label: t('squad') },
    { hash: '#news', path: '/news', label: t('news') },
    { hash: '#shop', path: '/shop', label: t('shop') },
    { hash: '#fan-zone', path: '/fan-wall', label: t('fanWall') },
  ];

  const handleNavClick = (e, hash) => {
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-bdk-bg/95 shadow-xl shadow-black/30' : 'bg-bdk-bg/85'} backdrop-blur-xl`}>
      <nav className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center bg-white/10 border border-white/20 shadow-[0_4px_20px_rgba(255,215,0,0.2)] group-hover:shadow-[0_4px_20px_rgba(255,215,0,0.4)] transition-all duration-500 overflow-hidden">
            <img src="/BDK_asset/logo/bahir-dar-kenema-fc-logo-png_seeklogo-553429.png" alt="BDK FC" className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tight text-white group-hover:text-bdk-accent transition-colors leading-tight">
              {language === 'am' ? 'ባህር ዳር ከነማ' : 'Bahir Dar Kenema FC'}
            </h1>
            <p className="text-[10px] text-bdk-light font-bold tracking-widest uppercase">The Waves of Lake Tana</p>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-sm">
          {navLinks.map(link => (
            <div key={link.hash} className="relative group/item flex items-center">
              <a
                href={link.hash}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="px-3.5 py-1.5 text-xs xl:text-sm font-bold text-gray-200 hover:text-bdk-accent transition-colors rounded-full hover:bg-white/10"
              >
                {link.label}
              </a>
              {link.path !== '/' && (
                <Link
                  to={link.path}
                  title={`Open standalone ${link.label} page`}
                  className="opacity-0 group-hover/item:opacity-100 text-[10px] text-bdk-accent hover:text-white transition-opacity pr-1.5 -ml-1 font-mono"
                >
                  ↗
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 shadow-sm"
            title="Toggle Language"
          >
            <span className="text-base">{language === 'en' ? '🇪🇹' : '🇬🇧'}</span>
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-3.5 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-bdk-dark text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-1.5"
              title="Open Admin Panel"
            >
              <span>⚙</span>
              <span>Admin Panel</span>
            </Link>
          )}

          {token ? (
            <Link to="/account" className="px-4 py-2 rounded-full bg-bdk-accent text-bdk-dark text-xs sm:text-sm font-black transition-all hover:bg-yellow-400 shadow-md">
              {user?.firstName ? `${user.firstName}` : t('myAccount')}
            </Link>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-full bg-bdk-accent text-bdk-dark text-xs sm:text-sm font-black transition-all hover:bg-yellow-400 shadow-md">
              {t('login')}
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-bdk-bg/95 backdrop-blur-xl border-b border-white/10 py-5 px-6 shadow-2xl mt-4">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <div key={link.hash} className="flex items-center justify-between border-b border-white/5 py-1">
                <a
                  href={link.hash}
                  onClick={(e) => handleNavClick(e, link.hash)}
                  className="text-base font-bold text-white hover:text-bdk-accent p-2 rounded-lg"
                >
                  {link.label}
                </a>
                {link.path !== '/' && (
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="text-xs bg-white/10 hover:bg-bdk-accent hover:text-bdk-dark px-3 py-1 rounded-full text-bdk-light font-bold transition"
                  >
                    Open Page ↗
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ====== HERO SECTION ======
function HeroSection() {
  const { language, t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden bg-bdk-bg pt-20 pb-10 sm:pt-24 sm:pb-12 lg:py-24">
      {/* Background ambient lighting and pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=")`
        }}></div>
        {/* Glow Spheres */}
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-bdk-accent/15 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Two-Column Layout on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & High-Impact CTA (5 cols) */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-5 sm:space-y-6">
            <AnimatedSection>
              {/* Est 1973 & League Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                  <span className="px-3 py-1 bg-bdk-accent text-bdk-dark rounded-full text-[10.5px] sm:text-[11px] font-black tracking-widest uppercase">
                    EST. 1973
                  </span>
                  <span className="px-3 py-1 text-white text-[10.5px] sm:text-[11px] font-bold tracking-wide">
                    {language === 'am' ? 'የኢትዮጵያ ፕሪሚየር ሊግ' : 'The Waves of Lake Tana'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white font-heading mt-2 sm:mt-3">
                {language === 'am' ? 'ባህር ዳር' : 'Bahir Dar'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bdk-accent via-yellow-200 to-white">
                  {language === 'am' ? 'ከነማ እግር ኳስ ክለብ' : 'Kenema FC'}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base md:text-lg text-blue-100 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                {language === 'am' 
                  ? 'የ 60,000 ደጋፊዎችን ድምፅ በባህር ዳር ስታዲየም ይለማመዱ። ጨዋታዎችን ይመልከቱ፣ ትኬቶችን ይቁረጡ፣ እና የሰማያዊውን ጦር ይቀላቀሉ።'
                  : 'Experience the thunderous roar of 60,000 passionate fans. Explore upcoming Premier League derbies, book stadium matchday tickets, and follow the Blue Army.'}
              </p>


              {/* Stadium & Security Badges */}
              <div className="pt-3.5 flex items-center justify-center lg:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs text-blue-200/90 font-semibold border-t border-white/10 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-bdk-accent">🏟️</span>
                  <span>60,000 Stadium Capacity</span>
                </div>
                <span className="hidden xs:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">⚡</span>
                  <span>Instant E-Tickets</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: 3D Interactive Infinite Event Marquee Carousel (7 cols) */}
          <div className="lg:col-span-7 w-full overflow-hidden pt-2 lg:pt-0">
            <HeroEventCarousel />
          </div>

        </div>
      </div>
    </section>
  );
}

// ====== STATS BANNER ======
function StatsBanner() {
  const { t } = useLanguage();
  const stats = [
    { value: '1973', label: t('founded') },
    { value: 'EPL', label: t('league') },
    { value: '33', label: t('proPlayers') },
    { value: '12th', label: t('twelfthMan') },
  ];

  return (
    <section className="py-10 border-y border-white/10 bg-white/5 backdrop-blur-md relative z-20 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 100} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tighter font-heading">{stat.value}</div>
              <div className="text-xs md:text-sm text-bdk-accent font-bold uppercase tracking-widest">{stat.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ====== MATCH CENTER / FIXTURES SECTION (Matches Navigation Sync) ======
function MatchCenterSection() {
  const { t, language } = useLanguage();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const res = await liveScoreAPI.getAll();
        setMatches(res.data.data || []);
      } catch (err) {
        console.error('Failed to load matches for home preview:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const upcomingMatch = matches.find(m => m.status === 'upcoming') || {
    homeTeam: 'Bahir Dar Kenema',
    awayTeam: 'Fasil Kenema',
    matchDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    matchTime: '16:00',
    venue: 'Bahir Dar International Stadium',
    competition: 'Ethiopian Premier League',
    status: 'upcoming'
  };

  const recentMatches = matches.filter(m => m.status === 'finished').slice(0, 2);

  return (
    <section id="matches" className="py-24 relative bg-bdk-dark border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-14">
          <div>
            <span className="section-label">Ethiopian Premier League</span>
            <h2 className="section-title">Match Center & <span className="text-bdk-light">Fixtures</span></h2>
            <p className="text-blue-200 text-base max-w-xl font-medium mt-2">
              Official schedule, stadium pass ticketing, and live match updates synchronized with the league.
            </p>
          </div>
          <Link
            to="/matches"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-bdk-accent font-bold text-xs uppercase tracking-wider border border-white/20 transition shadow-sm"
          >
            <span>Go to Matches Page</span>
            <span>→</span>
          </Link>
        </AnimatedSection>

        {/* Featured Upcoming Match Hero Card */}
        <AnimatedSection className="mb-12">
          <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-bdk-accent/30 bg-gradient-to-br from-bdk-primary/90 via-bdk-bg to-bdk-dark shadow-2xl">
            <div className="absolute top-0 right-0 bg-bdk-accent text-bdk-dark text-xs font-black uppercase px-6 py-2 rounded-bl-2xl tracking-widest shadow-md">
              Next Fixture
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-bdk-light bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
                  {upcomingMatch.competition || 'Ethiopian Premier League'}
                </span>
                <p className="text-sm text-blue-200 mt-3 font-medium">
                  📍 {upcomingMatch.venue} • 🕒 {upcomingMatch.matchTime || '15:00'}
                </p>
              </div>

              {/* Versus Row */}
              <div className="grid grid-cols-3 items-center text-center my-8">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 border-2 border-bdk-accent flex items-center justify-center p-3 shadow-lg mb-3">
                    <img src="/BDK_asset/logo/bahir-dar-kenema-fc-logo-png_seeklogo-553429.png" alt="Home" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-lg md:text-2xl font-black text-white font-heading">{upcomingMatch.homeTeam}</h4>
                  <span className="text-xs text-bdk-accent font-bold uppercase mt-1">Home</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-5xl font-black text-bdk-accent tracking-widest">VS</span>
                  <span className="text-xs text-blue-200 mt-2 font-mono">
                    {new Date(upcomingMatch.matchDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center p-3 shadow-lg mb-3">
                    <div className="text-3xl md:text-4xl">⚽</div>
                  </div>
                  <h4 className="text-lg md:text-2xl font-black text-white font-heading">{upcomingMatch.awayTeam}</h4>
                  <span className="text-xs text-gray-300 font-bold uppercase mt-1">Away</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 pt-6 border-t border-white/10">
                <Link
                  to="/matches"
                  className="w-full sm:w-auto px-8 py-3.5 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-full transition shadow-lg text-sm uppercase tracking-wider text-center"
                >
                  🎟️ Book Match Tickets (From 50 ETB)
                </Link>
                <Link
                  to="/matches"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition text-sm text-center"
                >
                  View Full Schedule & Standings
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Recent Results Grid */}
        {recentMatches.length > 0 && (
          <AnimatedSection>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Recent Results
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {recentMatches.map((m, idx) => (
                <div key={m._id || idx} className="card-glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-base">{m.homeTeam}</span>
                      <span className="text-2xl font-black text-white px-3 py-0.5 rounded bg-white/10">{m.homeScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-bold text-base">{m.awayTeam}</span>
                      <span className="text-2xl font-black text-white px-3 py-0.5 rounded bg-white/10">{m.awayScore}</span>
                    </div>
                  </div>
                  <div className="ml-6 pl-6 border-l border-white/10 text-right">
                    <span className="text-xs bg-green-500/20 text-green-300 font-bold px-2 py-1 rounded uppercase">FT</span>
                    <p className="text-[11px] text-gray-400 mt-2 font-medium">{m.venue?.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

// ====== CLUB NEWS SECTION (News Navigation Sync) ======
function NewsSection() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const res = await newsAPI.getAll({ limit: 3 });
        setArticles(res.data.data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load news for home preview:', err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  return (
    <section id="news" className="py-24 relative bg-bdk-bg border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-14">
          <div>
            <span className="section-label">Media & Press</span>
            <h2 className="section-title">Latest Club <span className="text-bdk-light">News</span></h2>
            <p className="text-blue-200 text-base max-w-xl font-medium mt-2">
              Official announcements, tactical breakdowns, and dressing room stories directly from Lake Tana.
            </p>
          </div>
          <Link
            to="/news"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-bdk-accent font-bold text-xs uppercase tracking-wider border border-white/20 transition shadow-sm"
          >
            <span>View All News Articles</span>
            <span>→</span>
          </Link>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((item) => (
              <AnimatedSection key={item._id} className="group flex flex-col justify-between card-glass rounded-2xl overflow-hidden border border-white/10 hover:border-bdk-accent/50 transition-all duration-300">
                <div>
                  <div className="relative h-52 overflow-hidden bg-bdk-dark">
                    <img
                      src={item.featuredImage?.url || item.image || '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => { e.target.src = '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp'; }}
                    />
                    <span className="absolute top-3 left-3 bg-bdk-dark/80 backdrop-blur-md text-bdk-accent text-[11px] font-black px-3 py-1 rounded-full border border-bdk-accent/30 uppercase tracking-wider">
                      {item.category || 'Club Update'}
                    </span>
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-blue-200 font-mono block mb-2">
                      {new Date(item.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-bdk-accent transition font-heading line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-blue-100 text-sm line-clamp-2 leading-relaxed">
                      {item.description || item.content?.slice(0, 120)}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/news/${item._id}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-bdk-accent hover:text-yellow-300 uppercase tracking-wider"
                  >
                    <span>Read Full Story</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ====== SQUAD SECTION (Squad Navigation Sync) ======
function SquadSection() {
  const { t } = useLanguage();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const loadSquad = async () => {
      try {
        setLoading(true);
        const res = await playerAPI.getAll();
        if (res.data.data && res.data.data.length > 0) {
          setPlayers(res.data.data);
        } else {
          setPlayers(fallbackSquad);
        }
      } catch (err) {
        console.warn('Using fallback squad data:', err);
        setPlayers(fallbackSquad);
      } finally {
        setLoading(false);
      }
    };
    loadSquad();
  }, []);

  const filtered = selectedRole === 'ALL'
    ? players
    : players.filter(p => (p.role === selectedRole || p.position === selectedRole));

  // Role color palette
  const roleBadges = {
    GK: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    DF: 'bg-green-500/20 text-green-300 border-green-500/40',
    MF: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    FW: 'bg-red-500/20 text-red-300 border-red-500/40'
  };

  return (
    <section id="squad" className="py-24 relative bg-bdk-dark border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="section-label">First Team 2024/25</span>
            <h2 className="section-title">Squad <span className="text-bdk-light">Roster</span></h2>
            <p className="text-blue-200 text-base font-medium mt-2">
              Meet our 32+ professional players representing Bahir Dar Kenema FC in the Ethiopian Premier League. Click any player for career stats!
            </p>
          </div>
          <Link
            to="/squad"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-bdk-accent font-bold text-xs uppercase tracking-wider border border-white/20 transition shadow-sm"
          >
            <span>Open Dedicated Squad Page</span>
            <span>→</span>
          </Link>
        </AnimatedSection>

        {/* Filter Tabs */}
        <AnimatedSection className="flex flex-wrap gap-2 justify-center mb-12">
          {[
            { id: 'ALL', label: 'All Squad' },
            { id: 'GK', label: 'Goalkeepers (GK)' },
            { id: 'DF', label: 'Defenders (DF)' },
            { id: 'MF', label: 'Midfielders (MF)' },
            { id: 'FW', label: 'Forwards (FW)' }
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
        </AnimatedSection>

        {/* Player Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 12).map((player) => (
              <div
                key={player._id || player.number}
                onClick={() => setSelectedPlayer(player)}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-bdk-accent/50 hover:shadow-xl cursor-pointer p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-4 overflow-hidden rounded-xl bg-bdk-bg aspect-square flex items-center justify-center">
                    <img
                      src={player.photo || '/BDK_asset/club team squad/images (43).jpeg'}
                      alt={player.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => { e.target.src = '/BDK_asset/club team squad/images (43).jpeg'; }}
                    />
                    <span className="absolute top-2.5 left-2.5 bg-bdk-dark/90 text-bdk-accent font-black text-sm px-2.5 py-1 rounded-md border border-white/10">
                      #{player.number}
                    </span>
                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase ${roleBadges[player.role || player.position] || 'bg-white/20 text-white border-white/20'}`}>
                      {player.role || player.position}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-bdk-accent transition truncate font-heading">
                    {player.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-blue-200 mt-1">
                    <span>{player.country} • {player.age} yrs</span>
                    <span className="text-bdk-light font-semibold">{player.position}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-300">
                  <span className="font-medium">View Career Stats</span>
                  <span className="text-bdk-accent font-bold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Roster Link */}
        <AnimatedSection className="mt-12 text-center">
          <Link
            to="/squad"
            className="inline-flex items-center gap-2 px-8 py-4 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-full transition shadow-xl text-sm uppercase tracking-wider"
          >
            <span>Explore Complete 32+ Player Roster on Squad Page</span>
            <span>→</span>
          </Link>
        </AnimatedSection>

        {/* Coaching Staff */}
        <AnimatedSection className="mt-20 pt-16 border-t border-white/10">
          <h3 className="text-3xl font-black text-white mb-10 text-center font-heading">Technical & Coaching Staff</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {coachingStaff.map((coach, i) => (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20 shadow-sm">
                  <svg className={`w-8 h-8 ${i === 0 ? 'text-bdk-accent' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{coach.name}</h4>
                <p className={`${i === 0 ? 'text-bdk-accent' : 'text-blue-200'} font-bold text-xs uppercase mb-2`}>{coach.role}</p>
                {coach.desc && <p className="text-blue-100 text-xs">{coach.desc}</p>}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Player Detail Modal (Same as Squad Page!) */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark max-w-md w-full p-6 rounded-3xl border border-white/20 relative animate-fade-in shadow-2xl">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-black text-xl w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-bdk-accent mb-3 shadow-xl bg-bdk-bg">
                <img
                  src={selectedPlayer.photo || '/BDK_asset/club team squad/images (43).jpeg'}
                  alt={selectedPlayer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-black text-white font-heading">{selectedPlayer.name}</h2>
              <p className="text-bdk-accent text-xs font-bold uppercase mt-1 tracking-wider">
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
              <h4 className="text-xs font-bold uppercase text-gray-300 mb-2">Season Performance</h4>
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
              className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition uppercase tracking-wider"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ====== SHOPPING SECTION (Shop Navigation Sync) ======
function ShopSection() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAll();
        if (res.data.data && res.data.data.length > 0) {
          setProducts(res.data.data);
        } else {
          setProducts(fallbackShop);
        }
      } catch (err) {
        console.warn('Using fallback shop data:', err);
        setProducts(fallbackShop);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = ['All', 'Jerseys', 'Training Wear', 'Accessories'];

  const filtered = products.filter(item => {
    const matchesCat = selectedCategory === 'All' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleQuickOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      toast.error('Please enter your shipping address and phone number');
      return;
    }

    try {
      setOrdering(true);
      const orderData = {
        items: [
          {
            product: quickOrderProduct._id,
            quantity: orderQuantity,
            size: selectedSize,
            price: quickOrderProduct.price
          }
        ],
        shippingAddress: {
          street: shippingAddress,
          city: 'Bahir Dar',
          phone: phone
        },
        paymentMethod: 'Telebirr'
      };

      await orderAPI.create(orderData);
      toast.success('🎉 Order placed successfully! Check your account for tracking.');
      setQuickOrderProduct(null);
      setShippingAddress('');
      setPhone('');
      setOrderQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <section id="shop" className="py-24 relative bg-bdk-bg border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="section-label">Official Store</span>
            <h2 className="section-title">Club Merchandise & <span className="text-bdk-light">Kits</span></h2>
            <p className="text-blue-200 text-base max-w-xl font-medium mt-2">
              Wear the Blue and Gold with pride. Authentic match jerseys, fan scarfs, and accessories delivered across Ethiopia.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-bdk-accent font-bold text-xs uppercase tracking-wider border border-white/20 transition shadow-sm"
          >
            <span>Open Dedicated Shop Page</span>
            <span>→</span>
          </Link>
        </AnimatedSection>

        {/* Filter and Search Bar */}
        <AnimatedSection className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
                  selectedCategory === cat
                    ? 'bg-bdk-accent text-bdk-dark shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search merchandise..."
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl text-xs focus:outline-none focus:border-bdk-accent placeholder-blue-300"
            />
          </div>
        </AnimatedSection>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.slice(0, 8).map(item => {
              const imageSrc = (item.images && item.images[0]?.url) || item.image || '/BDK_asset/club jerssey/1ndkit (1).webp';
              return (
                <div
                  key={item._id || item.id}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md hover:bg-white/10 hover:border-bdk-accent/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 bg-bdk-dark overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/BDK_asset/club jerssey/1ndkit (1).webp'; }}
                      />
                      {item.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                          -{item.discount}%
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-bdk-dark/80 backdrop-blur-md text-bdk-accent text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-bdk-accent/30 uppercase">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="text-base font-bold text-white mb-2 font-heading line-clamp-1 group-hover:text-bdk-accent transition">
                        {item.name}
                      </h4>
                      <p className="text-blue-100 text-xs line-clamp-2 leading-relaxed mb-4">
                        {item.description || 'Authentic Bahir Dar Kenema Football Club gear.'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-bdk-accent">
                          {item.price} <span className="text-xs font-normal text-gray-300">ETB</span>
                        </span>
                        {item.stock > 0 ? (
                          <span className="text-[11px] text-green-400 font-bold">In Stock ({item.stock})</span>
                        ) : (
                          <span className="text-[11px] text-red-400 font-bold">Out of stock</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    {item._id ? (
                      <Link
                        to={`/shop/${item._id}`}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-center text-xs font-bold rounded-xl transition"
                      >
                        Details
                      </Link>
                    ) : (
                      <Link
                        to="/shop"
                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-center text-xs font-bold rounded-xl transition"
                      >
                        Store
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setQuickOrderProduct(item);
                        setOrderQuantity(1);
                      }}
                      className="w-full py-2.5 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark text-xs font-black rounded-xl transition shadow-sm"
                    >
                      Quick Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Browse Store CTA */}
        <AnimatedSection className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-full transition shadow-xl text-sm uppercase tracking-wider"
          >
            <span>Browse Full Store Catalog (10+ Items)</span>
            <span>→</span>
          </Link>
        </AnimatedSection>
      </div>

      {/* Quick Order Modal */}
      {quickOrderProduct && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark max-w-md w-full p-6 rounded-3xl border border-white/20 relative animate-fade-in shadow-2xl">
            <button
              onClick={() => setQuickOrderProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-black text-xl w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-white font-heading mb-4">Quick Checkout (Telebirr)</h3>

            <div className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/10 mb-4 items-center">
              <img
                src={(quickOrderProduct.images && quickOrderProduct.images[0]?.url) || quickOrderProduct.image || '/BDK_asset/club jerssey/1ndkit (1).webp'}
                alt={quickOrderProduct.name}
                className="w-16 h-16 rounded-xl object-cover bg-bdk-bg"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{quickOrderProduct.name}</h4>
                <p className="text-bdk-accent font-black text-base">{quickOrderProduct.price} ETB</p>
              </div>
            </div>

            <form onSubmit={handleQuickOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-300 uppercase font-bold block mb-1">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-300 uppercase font-bold block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-300 uppercase font-bold block mb-1">Delivery Address (Street / Kebele)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kebele 04, Bahir Dar"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-300 uppercase font-bold block mb-1">Telebirr Mobile Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="0911XXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400"
                />
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-300">Total Payable:</span>
                <span className="text-lg font-black text-bdk-accent">{quickOrderProduct.price * orderQuantity} ETB</span>
              </div>

              <button
                type="submit"
                disabled={ordering}
                className="w-full py-3.5 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg mt-2"
              >
                {ordering ? 'Placing Order...' : 'Confirm Order & Pay with Telebirr'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// ====== FAN ZONE SECTION (Fan Wall Navigation Sync) ======
function FanZoneSection() {
  const { t } = useLanguage();
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        const res = await commentAPI.getFanDiscussions();
        setDiscussions(res.data.data?.slice(0, 3) || []);
      } catch (err) {
        console.warn('Could not load fan discussions preview:', err);
      }
    };
    loadDiscussions();
  }, []);

  return (
    <section id="fan-zone" className="py-24 relative bg-bdk-dark border-b border-white/10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <span className="section-label">The 12th Man</span>
            <h2 className="section-title">Heartbeat of the <span className="text-bdk-light">Club</span></h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 font-medium">
              From the roaring stands of our stadium to the away days across Ethiopia, your unwavering support is our ultimate motivation. We are nothing without the Blue Army.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-2.761-2.239-5-5-5s-5 2.239-5 5v2m10 0H7" /></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold">Exclusive Fan Events & Match Pre-parties</h4>
                  <p className="text-xs text-blue-200 font-medium">Gathering the Blue Army before every home match at Lake Tana.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-bdk-accent/20 flex items-center justify-center text-bdk-accent">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold">Interactive Fan Wall</h4>
                  <p className="text-xs text-blue-200 font-medium">Post your match predictions, debate line-ups, and chant with fellow supporters.</p>
                </div>
              </div>
            </div>

            <Link
              to="/fan-wall"
              className="inline-flex items-center gap-2 px-8 py-4 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-full transition shadow-lg text-sm uppercase tracking-wider"
            >
              <span>Join Fan Wall & Community Discussions</span>
              <span>💬</span>
            </Link>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-2 gap-4">
            <img src="/BDK_asset/club fan/images (27).jpeg" alt="Fans" className="w-full h-52 md:h-72 object-cover rounded-3xl shadow-xl border border-white/10" />
            <img src="/BDK_asset/club fan/images (28).jpeg" alt="Fans Chanting" className="w-full h-52 md:h-72 object-cover rounded-3xl shadow-xl mt-8 border border-white/10" />
          </AnimatedSection>
        </div>

        {/* Chants Card */}
        <AnimatedSection className="mt-20 p-1 bg-gradient-to-br from-bdk-light/40 via-white/5 to-bdk-accent/40 rounded-3xl shadow-xl">
          <div className="bg-bdk-bg rounded-[1.4rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-md">
            <h3 className="text-2xl font-black text-white mb-8 relative z-10 font-heading">Official Club Chants</h3>
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-bdk-light font-bold mb-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-bdk-light"></div>
                  We Are Bahir Dar
                </h4>
                <p className="text-blue-200 italic font-medium leading-relaxed">
                  "From the lake to the stands,<br />
                  We hold our flags in our hands.<br />
                  Blue and Gold, brave and bold,<br />
                  Bahir Dar Kenema, a story told!"
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-bdk-accent font-bold mb-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-bdk-accent"></div>
                  Victory Chant
                </h4>
                <p className="text-blue-200 italic font-medium leading-relaxed">
                  "Allez allez, Kenema allez!<br />
                  We fight today, we win today!<br />
                  For the city, for the pride,<br />
                  We stand together, side by side!"
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ====== ABOUT SECTION ======
function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-bdk-bg border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label">Our Heritage</span>
          <h2 className="section-title">A Legacy Built on <span className="text-bdk-light">Passion</span></h2>
          <p className="text-blue-200 text-lg leading-relaxed font-medium">
            Over 50 years of football excellence rooted in the vibrant city of Bahir Dar on the southern shore of Lake Tana.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection className="space-y-6">
            <div className="flex gap-6 group bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-bdk-light">73</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2 font-heading">Founded 1973 EC</h4>
                <p className="text-blue-100 text-sm leading-relaxed">Established in the heart of Bahir Dar, carrying the hopes and dreams of the entire region on our shoulders.</p>
              </div>
            </div>

            <div className="flex gap-6 group bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-bdk-accent/20 border border-bdk-accent/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-bdk-accent">18</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2 font-heading">Historic EPL Promotion</h4>
                <p className="text-blue-100 text-sm leading-relaxed">Secured our place in the top flight after an unforgettable promotion playoff run, now a powerhouse of Ethiopian football.</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 aspect-video shadow-2xl bg-bdk-dark">
              <img src="/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp" alt="Bahir Dar Stadium" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-2xl font-black text-white mb-1 font-heading">Bahir Dar International Stadium</h4>
                <p className="text-blue-200 text-sm">60,000 Capacity • The Fortress of the Blue Army.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ====== GALLERY SECTION ======
function GallerySection() {
  return (
    <section id="gallery" className="py-24 relative bg-bdk-dark border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label">Moments</span>
          <h2 className="section-title">Visual <span className="text-bdk-light">History</span></h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryData.map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-video cursor-pointer">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-lg font-bold text-white font-heading">{item.title}</h4>
                  <p className="text-blue-200 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ====== CONTACT & FAQ SECTION ======
function ContactSection() {
  const [formSent, setFormSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    e.target.reset();
  };

  return (
    <section id="contact" className="py-24 relative bg-bdk-bg border-b border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <AnimatedSection>
            <span className="section-label">Support</span>
            <h3 className="text-3xl font-black text-white mb-2 font-heading">Get in Touch</h3>
            <p className="text-blue-200 mb-8 font-medium">We're here to answer any inquiries regarding tickets, store orders, and membership.</p>

            {formSent && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="font-bold text-sm">Thank you! Your message was sent successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required className="bdk-input text-sm" />
                <input type="text" placeholder="Last Name" required className="bdk-input text-sm" />
              </div>
              <input type="email" placeholder="Email Address" required className="bdk-input text-sm" />
              <select required className="bdk-input text-sm cursor-pointer appearance-none">
                <option value="" disabled selected className="text-gray-900">Select Subject...</option>
                <option value="tickets" className="text-gray-900">Match Tickets & Passes</option>
                <option value="shop" className="text-gray-900">Merchandise Orders</option>
                <option value="general" className="text-gray-900">General Inquiry</option>
              </select>
              <textarea placeholder="Your Message" required rows="4" className="bdk-input text-sm resize-none"></textarea>
              <button type="submit" className="w-full bg-bdk-accent text-bdk-dark font-black py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-md font-heading text-sm uppercase tracking-wider">
                Send Message
              </button>
            </form>
          </AnimatedSection>

          <AnimatedSection>
            <span className="section-label">Questions</span>
            <h3 className="text-3xl font-black text-white mb-2 font-heading">Frequently Asked Questions</h3>
            <p className="text-blue-200 mb-8 font-medium">Quick answers for match days and club services.</p>
            <div className="space-y-3">
              {faqData.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left p-4 flex justify-between items-center">
                    <span className="text-white font-bold text-sm pr-4">{faq.q}</span>
                    <svg className={`w-4 h-4 text-bdk-accent flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="faq-answer">
                    <p className="px-4 pb-4 text-blue-200 text-xs font-medium leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ====== FOOTER ======
function FooterSection() {
  const { language } = useLanguage();

  return (
    <footer className="bg-bdk-dark pt-16 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 border border-white/20 p-2 rounded-full">
                <img src="/BDK_asset/logo/bahir-dar-kenema-fc-logo-png_seeklogo-553429.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <h3 className="text-xl font-black text-white font-heading">Bahir Dar Kenema FC</h3>
            </div>
            <p className="text-blue-200 max-w-sm mb-6 leading-relaxed text-sm">
              Professional football club competing at the highest tier of the Ethiopian Premier League. Home of the Blue Army.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-bdk-accent">Navigation</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link to="/matches" className="text-blue-200 hover:text-white transition-colors">Matches & Tickets</Link></li>
              <li><Link to="/squad" className="text-blue-200 hover:text-white transition-colors">Squad & Staff</Link></li>
              <li><Link to="/news" className="text-blue-200 hover:text-white transition-colors">News & Media</Link></li>
              <li><Link to="/shop" className="text-blue-200 hover:text-white transition-colors">Official Store</Link></li>
              <li><Link to="/fan-wall" className="text-blue-200 hover:text-white transition-colors">Fan Wall</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-bdk-accent">Contact</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li className="text-blue-200">Bahir Dar International Stadium</li>
              <li className="text-blue-200">Bahir Dar, Amhara, Ethiopia</li>
              <li className="text-blue-200">+251 58 220 1234</li>
              <li className="text-blue-200">info@bdkfc.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-blue-300">
          <p>© 2024 Bahir Dar Kenema Football Club. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/account" className="hover:text-white transition-colors">Fan Account</Link>
            <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ====== MAIN HOME COMPONENT ======
export default function Home() {
  return (
    <div className="overflow-x-hidden antialiased bg-bdk-bg text-white">
      <Navbar />
      <HeroSection />
      <StatsBanner />
      <MatchCenterSection />
      <NewsSection />
      <SquadSection />
      <ShopSection />
      <FanZoneSection />
      <AboutSection />
      <GallerySection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}
