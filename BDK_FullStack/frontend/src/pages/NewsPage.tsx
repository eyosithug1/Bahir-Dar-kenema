import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { Modal } from '../components/common/Modal';
import { Newspaper, Clock, User, Tag } from 'lucide-react';

interface NewsPageProps {
  news: NewsArticle[];
  activeArticle: NewsArticle | null;
  setActiveArticle: (article: NewsArticle | null) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({
  news,
  activeArticle,
  setActiveArticle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredNews = news.filter((n) => {
    if (selectedCategory === 'ALL') return true;
    return n.category.toUpperCase() === selectedCategory;
  });

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Newspaper size={24} color="var(--bdk-gold)" />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
            Club News & Press Releases
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Match analyses, player interviews, transfer updates, and community developments from the Waves of Tana.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        {['ALL', 'MATCH REPORT', 'CLUB NEWS', 'COMMUNITY', 'TRANSFER'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: selectedCategory === cat ? '1px solid var(--bdk-gold)' : '1px solid var(--border-color)',
              backgroundColor: selectedCategory === cat ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? 'var(--bdk-gold)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {cat === 'ALL' ? 'All Stories' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-responsive-3">
        {filteredNews.map((article) => (
          <div
            key={article.id}
            className="glass-panel"
            onClick={() => setActiveArticle(article)}
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--border-color)',
              transition: 'var(--transition)'
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
            <div>
              <div style={{ position: 'relative', height: '190px' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                    {article.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {article.summary}
                </p>
              </div>
            </div>

            <div style={{
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-dim)'
            }}>
              <span>{article.author}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          maxWidth="700px"
        >
          <div>
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.25rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-gold">{activeArticle.category}</span>
                <span>By {activeArticle.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                <span>{activeArticle.readTime}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
              {activeArticle.content}
            </div>

            {activeArticle.tags && (
              <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                {activeArticle.tags.map((tag) => (
                  <span key={tag} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
