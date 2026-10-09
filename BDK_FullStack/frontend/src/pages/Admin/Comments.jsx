import React, { useEffect, useState } from 'react';
import { commentAPI } from '../../services/api';
import toast from 'react-hot-toast';

function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, flagged: 0, fanWall: 0, newsComments: 0 });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { loadComments(); }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await commentAPI.getAllComments();
      const all = res.data.data || [];
      setComments(all);
      setStats({
        total: all.length,
        flagged: all.filter(c => c.isModerated || c.reportCount > 0).length,
        fanWall: all.filter(c => !c.newsId && !c.newsRef).length,
        newsComments: all.filter(c => c.newsId || c.newsRef).length
      });
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id) => {
    const reason = window.prompt('Enter moderation reason (or leave blank to hide):') ?? '';
    try {
      await commentAPI.moderate(id, reason);
      toast.success('Comment moderated');
      loadComments();
    } catch {
      toast.error('Failed to moderate comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this comment?')) return;
    try {
      await commentAPI.delete(id);
      toast.success('Comment deleted');
      setComments(prev => prev.filter(c => c._id !== id));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const filtered = comments
    .filter(c => {
      const text = (c.text || c.content || '').toLowerCase();
      const user = (c.user?.name || c.user?.firstName || '').toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase()) || user.includes(search.toLowerCase());
      if (filterType === 'flagged') return matchesSearch && (c.isModerated || c.reportCount > 0);
      if (filterType === 'fanWall') return matchesSearch && (!c.newsId && !c.newsRef);
      if (filterType === 'news') return matchesSearch && (c.newsId || c.newsRef);
      return matchesSearch;
    });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Comments Moderation</h1>
        <p className="text-gray-400 text-sm mt-1">Review and moderate fan wall posts and news comments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Comments', value: stats.total, color: 'text-white' },
          { label: 'Flagged / Hidden', value: stats.flagged, color: 'text-red-400' },
          { label: 'Fan Wall Posts', value: stats.fanWall, color: 'text-bdk-accent' },
          { label: 'News Comments', value: stats.newsComments, color: 'text-blue-400' }
        ].map(s => (
          <div key={s.label} className="card-glass p-4 rounded-xl border border-white/10 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Search by message or user..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-bdk-accent" />
        <div className="flex gap-2">
          {['all', 'flagged', 'fanWall', 'news'].map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition ${filterType === f ? 'bg-bdk-accent text-bdk-dark' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>
              {f === 'fanWall' ? 'Fan Wall' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="card-glass rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-3xl mb-2">💬</p>
            <p>No comments found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(comment => {
              const authorName = comment.user?.name || (comment.user?.firstName ? `${comment.user.firstName} ${comment.user.lastName || ''}`.trim() : 'Anonymous');
              const isFlagged = comment.isModerated || comment.reportCount > 0;
              return (
                <div key={comment._id} className={`p-5 hover:bg-white/5 transition ${isFlagged ? 'border-l-2 border-red-500' : ''}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-bdk-primary to-bdk-accent text-white font-black flex items-center justify-center text-sm flex-shrink-0">
                        {authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-white text-sm">{authorName}</span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                          {comment.newsId || comment.newsRef ? (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">News Comment</span>
                          ) : (
                            <span className="text-[10px] bg-bdk-accent/20 text-bdk-accent px-2 py-0.5 rounded-full font-bold">Fan Wall</span>
                          )}
                          {isFlagged && (
                            <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">⚠️ Flagged</span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed break-words">
                          {comment.text || comment.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>❤️ {comment.likes?.length || 0} likes</span>
                          {comment.reportCount > 0 && <span className="text-red-400">🚩 {comment.reportCount} reports</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleModerate(comment._id)}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-xs font-bold transition whitespace-nowrap">
                        Moderate
                      </button>
                      <button onClick={() => handleDelete(comment._id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComments;
