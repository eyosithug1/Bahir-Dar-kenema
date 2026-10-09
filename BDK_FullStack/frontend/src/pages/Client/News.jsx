import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../../services/api';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function ClientNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const res = await newsAPI.getAll({ category: selectedCategory, search: searchTerm });
        setNews(res.data.data || []);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Club News & Updates</h1>
        <p className="text-gray-300">Match reports, player interviews and official announcements</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {['all', 'Match Report', 'News', 'Update', 'Interview', 'Event'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition capitalize ${
                selectedCategory === cat
                  ? 'bg-bdk-accent text-bdk-dark'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat === 'all' ? 'All News' : cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 w-full md:w-64"
        />
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner"></div></div>
      ) : news.length === 0 ? (
        <div className="card-glass p-12 text-center text-gray-400 rounded-xl">
          No articles found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link
              key={item._id}
              to={`/news/${item._id}`}
              className="card-glass p-6 rounded-xl hover:bg-white/15 transition group flex flex-col justify-between"
            >
              <div>
                {item.featuredImage && (
                  <img
                    src={item.featuredImage.url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <span className="text-xs font-bold text-bdk-accent uppercase bg-bdk-accent/10 px-2.5 py-1 rounded-full">
                  {item.category || 'News'}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-bdk-accent transition mt-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="text-bdk-light text-xs mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-bdk-accent">Read Article →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
      <ClientFooter />
    </div>
  );
}

export default ClientNews;
