import React from 'react';
import { Newspaper, ChevronRight, Clock } from 'lucide-react';
import { NewsArticle } from '../../types';

interface LatestNewsSectionProps {
  news: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onViewAll: () => void;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  news,
  onSelectArticle,
  onViewAll,
}) => {
  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Latest News & Press Releases
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Official updates from Bahir Dar Kenema football club
          </p>
        </div>
        <button
          onClick={onViewAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--bdk-gold)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <span>All News</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid-responsive-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="glass-panel"
            onClick={() => onSelectArticle(item)}
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transition: 'var(--transition)',
              border: '1px solid var(--border-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px'
              }}>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                  {item.category}
                </span>
              </div>
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.4,
                  marginBottom: '0.6rem'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.summary}
                </p>
              </div>

              <div style={{
                marginTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-dim)'
              }}>
                <span>{item.author}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  <span>{item.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
