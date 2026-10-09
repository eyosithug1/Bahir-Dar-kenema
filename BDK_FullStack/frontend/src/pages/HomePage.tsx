import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { NextMatchCard } from '../components/home/NextMatchCard';
import { StandingsWidget } from '../components/home/StandingsWidget';
import { ClubStats } from '../components/home/ClubStats';
import { LatestNewsSection } from '../components/home/LatestNewsSection';
import { MatchCard } from '../components/matches/MatchCard';
import { Match, LeagueStanding, NewsArticle } from '../types';

interface HomePageProps {
  matches: Match[];
  standings: LeagueStanding[];
  news: NewsArticle[];
  setActiveTab: (tab: string) => void;
  onBookTickets: (match: Match) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  matches,
  standings,
  news,
  setActiveTab,
  onBookTickets,
  onSelectArticle,
}) => {
  const nextMatch = matches.find((m) => m.status === 'UPCOMING') || matches[0];
  const recentResults = matches.filter((m) => m.status === 'COMPLETED').slice(0, 2);

  return (
    <div className="container">
      {/* Hero Section */}
      <HeroBanner
        onBuyTickets={() => setActiveTab('tickets')}
        onExploreStore={() => setActiveTab('store')}
        onViewSquad={() => setActiveTab('squad')}
      />

      {/* Main Grid: Next Match & Standings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {nextMatch && (
          <NextMatchCard match={nextMatch} onBookTickets={onBookTickets} />
        )}
        <StandingsWidget standings={standings} onViewAll={() => setActiveTab('standings')} />
      </div>

      {/* Club Numbers and Heritage */}
      <ClubStats />

      {/* Recent Match Form Section */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Recent Match Results</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest Ethiopian Premier League fixtures</p>
          </div>
          <button
            onClick={() => setActiveTab('matches')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--bdk-gold)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            All Results →
          </button>
        </div>

        <div className="grid-responsive-3">
          {recentResults.map((match) => (
            <MatchCard key={match.id} match={match} onBookTickets={onBookTickets} />
          ))}
        </div>
      </div>

      {/* Latest News */}
      <LatestNewsSection
        news={news.slice(0, 3)}
        onSelectArticle={onSelectArticle}
        onViewAll={() => setActiveTab('news')}
      />
    </div>
  );
};
