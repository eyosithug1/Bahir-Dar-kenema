import React, { useEffect, useState } from 'react';
import { commentAPI } from '../../services/api';
import { useAuthStore } from '../../context/authStore';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function FanWall() {
  const { user } = useAuthStore();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const res = await commentAPI.getFanDiscussions();
      setDiscussions(res.data.data || []);
    } catch (error) {
      console.error('Failed to load fan discussions:', error);
      toast.error('Failed to load fan posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      setSubmitting(true);
      const res = await commentAPI.postOnWall(newPostText);
      toast.success('🎉 Message posted to Fan Wall!');
      setNewPostText('');
      setDiscussions([res.data.data, ...discussions]);
    } catch (error) {
      console.error('Post error:', error);
      toast.error(error.response?.data?.message || 'Failed to post on wall');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await commentAPI.toggleLike(id);
      setDiscussions((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, likes: res.data.data?.likes || (item.likes?.includes(user?._id) ? item.likes.filter(uid => uid !== user?._id) : [...(item.likes || []), user?._id]) }
            : item
        )
      );
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Could not update like');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await commentAPI.delete(id);
      toast.success('Message removed');
      setDiscussions((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete message');
    }
  };

  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (activeTab === 'popular') {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-bdk-primary via-bdk-bg to-bdk-dark p-8 border border-white/10 shadow-2xl text-center">
        <span className="text-xs font-black uppercase text-bdk-accent bg-bdk-accent/10 px-3 py-1 rounded-full border border-bdk-accent/30 tracking-wider">
          Waves of Tana Community
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white mt-3 mb-2 tracking-tight">
          Official Fan Wall
        </h1>
        <p className="text-bdk-light text-sm md:text-base max-w-xl mx-auto">
          Shout out your support, share match predictions, and connect with fellow Bahir Dar Kenema supporters across the world!
        </p>
      </div>

      {/* New Post Creator Box */}
      <div className="card-glass p-6 rounded-2xl border border-white/10 mb-8 shadow-xl">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-bdk-accent text-bdk-dark font-black flex items-center justify-center text-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share your thoughts, matchday cheer, or chants for the team..."
                rows="3"
                maxLength="500"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-bdk-accent resize-none placeholder-gray-500"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                  {500 - newPostText.length} characters left
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newPostText.trim()}
                  className="btn-primary py-2 px-6 rounded-xl text-xs font-black transition disabled:opacity-40"
                >
                  {submitting ? 'Posting...' : 'Post Message 💬'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feed Filters */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Community Feed ({discussions.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeTab === 'latest' ? 'bg-bdk-accent text-bdk-dark' : 'text-gray-400 hover:text-white'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeTab === 'popular' ? 'bg-bdk-accent text-bdk-dark' : 'text-gray-400 hover:text-white'
            }`}
          >
            Most Liked 🔥
          </button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="spinner"></div>
        </div>
      ) : sortedDiscussions.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <p className="text-4xl mb-3">💬</p>
          <h3 className="text-lg font-bold text-white mb-1">No messages yet!</h3>
          <p className="text-gray-400 text-xs">Be the first to post a cheer on the Bahir Dar Kenema fan wall!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDiscussions.map((item) => {
            const hasLiked = item.likes?.includes(user?._id);
            const isAuthor = item.user?._id === user?._id || item.user === user?._id;

            const authorName = item.user?.name || (item.user?.firstName ? `${item.user.firstName} ${item.user.lastName || ''}`.trim() : 'Waves Supporter');

            return (
              <div
                key={item._id}
                className="card-glass p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bdk-primary to-bdk-accent text-white font-black flex items-center justify-center text-sm shadow">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {authorName}
                        </span>
                        {item.user?.role === 'admin' && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                            Official Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {isAuthor && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-gray-500 hover:text-red-400 text-xs transition"
                      title="Delete your message"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <p className="text-gray-200 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <button
                    onClick={() => handleLike(item._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                      hasLiked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    <span>{hasLiked ? '❤️' : '🤍'}</span>
                    <span>{item.likes?.length || 0} Likes</span>
                  </button>
                  <span className="text-gray-500 text-[11px]">#WavesOfTana</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
      <ClientFooter />
    </div>
  );
}

export default FanWall;
