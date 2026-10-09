import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { heroEventAPI } from '../../services/api';

// Fallback initial BDK cards in case of loading or offline
const fallbackEvents = [
  {
    _id: 'fb-1',
    title: 'Tana Derby: BDK vs Fasil Kenema',
    category: '🔥 Tana Derby',
    image: { url: '/BDK_asset/club team squad/bahir-dar-kenema-continue-chasing-saint-george-in-the-v0-20zfjd3aspsa1.jpg' },
    date: 'Sun, Nov 15 • 16:00 EAT',
    venue: "Bahir Dar Int'l Stadium",
    ticketPrice: 'From 50 ETB • VIP 200 ETB',
    badgeColor: 'gold',
    link: '/matches'
  },
  {
    _id: 'fb-2',
    title: 'Ethiopian Premier League: BDK vs Saint George',
    category: '🏆 Premier League',
    image: { url: '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp' },
    date: 'Sat, Nov 21 • 15:00 EAT',
    venue: "Bahir Dar Int'l Stadium (60k)",
    ticketPrice: 'From 60 ETB',
    badgeColor: 'blue',
    link: '/matches'
  },
  {
    _id: 'fb-3',
    title: 'CAF Confederation Cup: Group Stage Clash',
    category: '🌍 Continental Cup',
    image: { url: '/BDK_asset/club team squad/photo_2026-02-14_09-02-45.jpg' },
    date: 'Wed, Dec 02 • 19:00 EAT',
    venue: "Bahir Dar Int'l Stadium",
    ticketPrice: 'From 100 ETB • VIP 350 ETB',
    badgeColor: 'green',
    link: '/matches'
  },
  {
    _id: 'fb-4',
    title: '50th Jubilee Fan Festival & Trophy Gala',
    category: '🎉 Club Festival',
    image: { url: '/BDK_asset/club jerssey/1ndkit (1).webp' },
    date: 'Sat, Dec 12 • 10:00 EAT',
    venue: 'Lake Tana Waterfront Arena',
    ticketPrice: 'Free Entry • Fans Welcome',
    badgeColor: 'purple',
    link: '/fan-wall'
  }
];

export default function HeroEventCarousel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await heroEventAPI.getActive();
      if (res.data?.data && res.data.data.length > 0) {
        setEvents(res.data.data);
      } else {
        setEvents(fallbackEvents);
      }
    } catch (err) {
      console.warn('Failed to fetch hero events, using fallback:', err);
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const activeItems = events.length > 0 ? events : fallbackEvents;
  const total = activeItems.length;

  // Auto-advance every 3.8s with smooth Zoom-In / Zoom-Out transition
  useEffect(() => {
    if (total <= 1 || isHovered) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3800);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [total, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsHovered(true);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isSwipeLeft = distance > 45;
    const isSwipeRight = distance < -45;

    if (isSwipeLeft) {
      handleNext();
    } else if (isSwipeRight) {
      handlePrev();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Helper to safely format image URLs (supports local assets, server uploads, external links)
  const getImageUrl = (img) => {
    if (!img) return '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp';
    const url = typeof img === 'string' ? img : img.url;
    if (!url) return '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/BDK_asset')) {
      return url;
    }
    if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
      const clean = url.startsWith('/') ? url : `/${url}`;
      return `http://localhost:5000${clean}`;
    }
    return url;
  };

  // Helper to compute card position in 3D Zoom Stage for any number of cards (1 to N)
  const getCardPositionClass = (index) => {
    if (total === 1) return 'zoom-card-active';

    const diff = (index - currentIndex + total) % total;

    if (diff === 0) {
      return 'zoom-card-active';
    }
    if (diff === 1 || (total === 2 && diff === 1)) {
      return 'zoom-card-right';
    }
    if (diff === total - 1) {
      return 'zoom-card-left';
    }
    if (total >= 4 && diff === 2) {
      return 'zoom-card-far-right';
    }
    if (total >= 5 && diff === total - 2) {
      return 'zoom-card-far-left';
    }
    return 'zoom-card-hidden';
  };

  const getBadgeStyle = (badgeColor) => {
    switch (badgeColor) {
      case 'gold':
        return 'bg-yellow-500/25 text-yellow-300 border-yellow-400/50 shadow-yellow-500/20';
      case 'green':
        return 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-emerald-500/20';
      case 'blue':
        return 'bg-blue-500/25 text-blue-300 border-blue-400/50 shadow-blue-500/20';
      case 'purple':
        return 'bg-purple-500/25 text-purple-300 border-purple-400/50 shadow-purple-500/20';
      case 'red':
        return 'bg-red-500/25 text-red-300 border-red-400/50 shadow-red-500/20';
      default:
        return 'bg-bdk-accent/25 text-bdk-accent border-bdk-accent/50 shadow-yellow-500/20';
    }
  };

  return (
    <div
      className="w-full relative py-1 sm:py-2 select-none touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient spotlight lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-40 sm:h-48 bg-bdk-accent/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-40 sm:h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* 3D Stage Container (Responsive Height for mobile & desktop) */}
      <div className="zoom-stage-container relative h-[340px] xs:h-[370px] sm:h-[415px] md:h-[440px] flex items-center justify-center overflow-hidden">
        {activeItems.map((item, index) => {
          const positionClass = getCardPositionClass(index);
          const isActive = positionClass === 'zoom-card-active';
          const destination = item.link || '/matches';

          return (
            <div
              key={item._id || index}
              onClick={() => {
                if (!isActive) {
                  setCurrentIndex(index);
                }
              }}
              className={`zoom-card-base absolute w-[215px] xs:w-[235px] sm:w-[265px] md:w-[285px] rounded-2xl overflow-hidden card-glass border transition-all ${
                isActive
                  ? 'border-bdk-accent/80 shadow-[0_12px_45px_rgba(255,215,0,0.35)] bg-bdk-dark/95'
                  : 'border-white/10 hover:border-white/30 bg-bdk-dark/80 cursor-pointer'
              } ${positionClass}`}
            >
              <Link to={isActive ? destination : '#'} onClick={(e) => { if (!isActive) e.preventDefault(); }} className="block">
                {/* Tall High-Impact Event Banner Image (Responsive Height) */}
                <div className="relative h-[185px] xs:h-[205px] sm:h-[235px] md:h-[255px] w-full overflow-hidden bg-black/60">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'animate-ken-burns' : 'scale-100'}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp';
                    }}
                  />

                  {/* Dark gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bdk-dark/95 via-bdk-dark/20 to-transparent"></div>

                  {/* Floating Category Badge */}
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
                    <span className={`text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-md ${getBadgeStyle(item.badgeColor)}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Starting Ticket Price Pill */}
                  <div className="absolute bottom-2 right-2 sm:right-2.5 z-10">
                    <span className="text-[8.5px] sm:text-[9px] font-black text-white bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                      {item.ticketPrice}
                    </span>
                  </div>

                  {/* Active Card Neon Indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Details Content (Compact & Sleek) */}
                <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 bg-gradient-to-b from-transparent to-bdk-dark/95">
                  <h3 className={`font-black text-white text-[11.5px] sm:text-sm leading-snug line-clamp-1 transition-colors ${isActive ? 'text-bdk-accent' : ''}`}>
                    {item.title}
                  </h3>

                  {/* Date & Time pill + Venue pin */}
                  <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5 text-blue-200">
                      <span className="text-bdk-accent text-[9px] sm:text-[10px]">📅</span>
                      <span className="font-semibold truncate text-[9.5px] sm:text-[11px]">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span className="text-[9px] sm:text-[10px]">📍</span>
                      <span className="truncate text-[9.5px] sm:text-[11px]">{item.venue}</span>
                    </div>
                  </div>

                  {/* Interactive Action Row */}
                  <div className="pt-1 sm:pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
                    <span className={`flex items-center gap-1 text-[9.5px] sm:text-[10px] ${isActive ? 'text-bdk-accent font-black' : 'text-gray-400'}`}>
                      {isActive ? 'Book Match Tickets' : 'Click to View'} <span>→</span>
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-gray-400 font-medium uppercase tracking-wider">
                      BDK Matchday
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Touch Swipe Pagination */}
      <div className="flex items-center justify-between px-2 sm:px-3 pt-1 sm:pt-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-bdk-accent hover:text-bdk-dark active:scale-95 text-white flex items-center justify-center text-xs font-bold transition-all border border-white/15 backdrop-blur-md shadow"
          title="Previous match"
        >
          ‹
        </button>

        {/* Progress Pagination & Mobile Swipe Hint */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            {activeItems.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentIndex === idx
                    ? 'w-5 sm:w-6 bg-bdk-accent shadow-[0_0_8px_rgba(255,215,0,0.6)]'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`Jump to event ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-[9px] text-gray-400/80 sm:hidden">
            👈 Swipe or Tap to Switch 👉
          </span>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-bdk-accent hover:text-bdk-dark active:scale-95 text-white flex items-center justify-center text-xs font-bold transition-all border border-white/15 backdrop-blur-md shadow"
          title="Next match"
        >
          ›
        </button>
      </div>
    </div>
  );
}
