import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI, commentAPI } from '../../services/api';
import { useAuthStore } from '../../context/authStore';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function NewsArticle() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null); // { commentId, targetName }
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getById(id);
      const data = res.data.data || res.data;
      setArticle(data);
      setLikeCount(data.likes?.length || 0);
      setLiked(user?._id && data.likes?.includes(user._id));

      // Load comments for this news
      try {
        const cRes = await commentAPI.getNewsComments(id);
        const fetchedComments = cRes.data.data || [];
        setComments(fetchedComments);
      } catch {
        // comments optional
      }
    } catch (err) {
      console.error('Failed to load article:', err);
      toast.error('Article not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await newsAPI.toggleLike(id);
      setLiked(prev => !prev);
      setLikeCount(prev => (liked ? prev - 1 : prev + 1));
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setSubmittingComment(true);
      const res = await commentAPI.postOnNews(id, commentText.trim());
      const newComment = res.data.data;
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentAPI.delete(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment removed');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast('Please sign in to like comments', { icon: '❤️' });
      return;
    }
    try {
      await commentAPI.toggleLike(commentId);
      const currentUserId = user._id || user.id;
      setComments(prev => prev.map(c => {
        if (c._id !== commentId) return c;
        const alreadyLiked = isLikedByUser(c.likes);
        const newLikes = alreadyLiked
          ? (c.likes || []).filter(l => String(typeof l === 'object' ? l._id : l) !== String(currentUserId))
          : [...(c.likes || []), currentUserId];
        return { ...c, likes: newLikes };
      }));
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleStartReply = (comment, targetAuthorObj = null) => {
    if (!user) {
      toast('Please sign in to reply', { icon: '💬' });
      return;
    }
    const targetName = getAuthorName(targetAuthorObj || comment.author || comment.user);
    setReplyingTo({
      commentId: comment._id,
      targetName
    });
    setExpandedReplies(prev => ({ ...prev, [comment._id]: true }));
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      setSubmittingReply(true);
      const targetUserTag = replyingTo?.targetName ? `@${replyingTo.targetName}` : '';
      const res = await commentAPI.reply(commentId, {
        text: replyText.trim(),
        replyToUser: targetUserTag
      });
      const updatedComment = res.data.data;
      setComments(prev => prev.map(c => c._id === commentId ? updatedComment : c));
      setReplyText('');
      setReplyingTo(null);
      setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
      toast.success('Reply posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    if (!user) {
      toast('Please sign in to like replies', { icon: '❤️' });
      return;
    }
    try {
      await commentAPI.toggleReplyLike(commentId, replyId);
      const currentUserId = user._id || user.id;
      setComments(prev => prev.map(c => {
        if (c._id !== commentId) return c;
        return {
          ...c,
          replies: (c.replies || []).map(r => {
            if (r._id !== replyId) return r;
            const alreadyLiked = isLikedByUser(r.likes);
            const newLikes = alreadyLiked
              ? (r.likes || []).filter(l => String(typeof l === 'object' ? l._id : l) !== String(currentUserId))
              : [...(r.likes || []), currentUserId];
            return { ...r, likes: newLikes };
          })
        };
      }));
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const res = await commentAPI.deleteReply(commentId, replyId);
      if (res.data?.data) {
        setComments(prev => prev.map(c => c._id === commentId ? res.data.data : c));
      } else {
        setComments(prev => prev.map(c => {
          if (c._id !== commentId) return c;
          return {
            ...c,
            replies: (c.replies || []).filter(r => r._id !== replyId)
          };
        }));
      }
      toast.success('Reply removed');
    } catch (err) {
      console.error('Failed to delete reply:', err);
      toast.error('Failed to delete reply');
    }
  };

  const toggleRepliesExpansion = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Helper functions
  const getAuthorName = (authorObj) => {
    if (!authorObj) return 'Fan';
    if (typeof authorObj === 'string') return 'Fan';
    if (authorObj.firstName) {
      return `${authorObj.firstName} ${authorObj.lastName || ''}`.trim();
    }
    if (authorObj.name) return authorObj.name;
    return 'Fan';
  };

  const getAuthorInitial = (authorObj) => {
    const name = getAuthorName(authorObj);
    return name.charAt(0).toUpperCase() || 'F';
  };

  const currentUserId = user?._id || user?.id;

  const isAuthorOrAdmin = (authorObj) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const authorId = typeof authorObj === 'object' ? (authorObj?._id || authorObj?.id) : authorObj;
    return authorId && String(authorId) === String(currentUserId);
  };

  const isLikedByUser = (likesArray) => {
    if (!currentUserId || !Array.isArray(likesArray)) return false;
    return likesArray.some(l => {
      const lId = typeof l === 'object' ? (l?._id || l?.id) : l;
      return lId && String(lId) === String(currentUserId);
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const past = new Date(dateString);
      const diff = Math.floor((new Date() - past) / 1000);
      if (isNaN(diff) || diff < 0) return 'just now';
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return past.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const totalCommentsCount = (comments || []).reduce(
    (acc, c) => acc + 1 + ((c?.replies || []).length),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
        <ClientNavbar />
        <div className="flex justify-center items-center h-96">
          <div className="spinner"></div>
        </div>
        <ClientFooter />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
        <ClientNavbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="card-glass p-12 rounded-2xl max-w-lg mx-auto border border-white/10">
            <p className="text-4xl mb-4">📰</p>
            <h2 className="text-2xl font-black text-white mb-2">Article Not Found</h2>
            <p className="text-gray-400 text-sm mb-6">This article may have been removed or is not available.</p>
            <Link to="/news" className="btn-primary px-6 py-2.5 rounded-lg text-sm font-bold inline-block">
              Back to News
            </Link>
          </div>
        </div>
        <ClientFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link to="/news" className="hover:text-white transition">News</Link>
          <span>/</span>
          <span className="text-bdk-accent truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-xs font-black uppercase text-bdk-accent bg-bdk-accent/10 px-3 py-1 rounded-full border border-bdk-accent/30">
            {article.category || 'News'}
          </span>
          <span className="text-xs text-gray-400">
            {article.createdAt ? new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
          </span>
          {article.author && (
            <span className="text-xs text-gray-400">
              By <span className="text-white font-semibold">{article.author?.name || article.author?.firstName || 'BDK Staff'}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Featured Image */}
        {article.featuredImage?.url && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/10">
            <img
              src={article.featuredImage.url}
              alt={article.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Summary / Description */}
        {article.description && (
          <p className="text-lg text-bdk-light italic border-l-4 border-bdk-accent pl-4 mb-8 leading-relaxed">
            {article.description}
          </p>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-8">
          {(article.content || '').split('\n').map((para, i) => (
            para.trim() ? (
              <p key={i} className="text-gray-200 leading-relaxed mb-4 text-base">
                {para}
              </p>
            ) : <div key={i} className="h-2" />
          ))}
        </div>

        {/* Extra Images */}
        {article.images && article.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {article.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`${article.title} photo ${i + 1}`}
                className="rounded-xl object-cover aspect-video w-full border border-white/10"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs bg-white/5 text-gray-300 border border-white/10 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Like & Share */}
        <div className="flex items-center gap-4 py-6 border-y border-white/10 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition border ${
              liked
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>
          <Link
            to="/fan-wall"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition"
          >
            💬 Discuss on Fan Wall
          </Link>
          <Link to="/news" className="ml-auto text-xs text-bdk-accent hover:underline font-bold">
            ← All News
          </Link>
        </div>

        {/* TikTok-Style Comments & Replies Section */}
        <div id="comments-section">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">Comments</h2>
              <span className="bg-bdk-accent/20 text-bdk-accent text-xs font-black px-2.5 py-1 rounded-full border border-bdk-accent/30">
                {totalCommentsCount}
              </span>
            </div>
            <span className="text-xs text-gray-400">Join the discussion</span>
          </div>

          {/* Top-Level Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="card-glass p-5 rounded-2xl border border-white/10 mb-8 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bdk-accent to-emerald-400 text-bdk-dark font-black flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                  {(user.name || user.firstName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add a comment... (share your thoughts with the BDK family)"
                    rows="3"
                    maxLength="500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-bdk-accent transition resize-none placeholder-gray-500"
                  />
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[11px] text-gray-500">{500 - commentText.length} characters left</span>
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="btn-primary py-2 px-6 rounded-xl text-xs font-black disabled:opacity-40 shadow transition hover:scale-[1.02]"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="card-glass p-6 rounded-2xl border border-white/10 mb-8 text-center text-sm text-gray-400 shadow-lg">
              <p className="mb-2">Want to share your thoughts on this story?</p>
              <Link to="/login" className="btn-primary inline-block px-5 py-2 rounded-xl text-xs font-black">
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments Thread List */}
          {comments.length === 0 ? (
            <div className="card-glass p-12 text-center rounded-2xl border border-white/10 text-gray-400">
              <p className="text-3xl mb-3">💬</p>
              <h3 className="text-white font-bold mb-1">No comments yet</h3>
              <p className="text-xs text-gray-400">Be the first to share your reaction!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => {
                const authorObj = comment.author || comment.user;
                const authorName = getAuthorName(authorObj);
                const authorInitial = getAuthorInitial(authorObj);
                const isOwn = isAuthorOrAdmin(authorObj);
                const isLiked = isLikedByUser(comment.likes);
                const likesCount = (comment.likes || []).length;
                const repliesCount = (comment.replies || []).length;
                const isRepliesOpen = expandedReplies[comment._id];
                const isReplyingThis = replyingTo?.commentId === comment._id;

                return (
                  <div key={comment._id} className="card-glass p-4 md:p-5 rounded-2xl border border-white/10 transition hover:border-white/20">
                    {/* Top-Level Comment Header & Body */}
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-bdk-primary via-emerald-600 to-bdk-accent text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow">
                        {authorObj?.avatar ? (
                          <img src={authorObj.avatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          authorInitial
                        )}
                      </div>

                      {/* Content & Actions */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm hover:underline cursor-pointer">
                              {authorName}
                            </span>
                            {authorObj?.role === 'admin' && (
                              <span className="text-[10px] bg-bdk-accent/20 text-bdk-accent border border-bdk-accent/30 px-1.5 py-0.5 rounded font-black">
                                ADMIN
                              </span>
                            )}
                            <span className="text-[11px] text-gray-500">
                              • {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>

                          {/* Top-Level Delete if author or admin */}
                          {isOwn && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              title="Delete comment"
                              className="text-gray-500 hover:text-red-400 text-xs p-1 transition"
                            >
                              🗑️
                            </button>
                          )}
                        </div>

                        {/* Comment text */}
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {comment.text || comment.content}
                        </p>

                        {/* Action Bar (TikTok Style: Reply button + Heart Like count) */}
                        <div className="flex items-center gap-5 mt-2.5 text-xs text-gray-400 font-semibold">
                          <button
                            onClick={() => handleStartReply(comment, authorObj)}
                            className="hover:text-bdk-accent transition flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span>Reply</span>
                          </button>

                          <button
                            onClick={() => handleLikeComment(comment._id)}
                            className={`flex items-center gap-1.5 transition ${
                              isLiked ? 'text-red-400 font-bold' : 'hover:text-red-400'
                            }`}
                          >
                            <span>{isLiked ? '❤️' : '🤍'}</span>
                            <span>{likesCount > 0 ? likesCount : 'Like'}</span>
                          </button>
                        </div>

                        {/* TikTok-Style Toggle Replies Button ("── View 3 replies ▾") */}
                        {repliesCount > 0 && (
                          <div className="mt-3">
                            <button
                              onClick={() => toggleRepliesExpansion(comment._id)}
                              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-bdk-accent transition group"
                            >
                              <span className="w-6 h-[1.5px] bg-gray-600 group-hover:bg-bdk-accent transition"></span>
                              <span>
                                {isRepliesOpen
                                  ? `Hide replies`
                                  : `View ${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}`}
                              </span>
                              <span className="text-[10px] transform transition duration-200">
                                {isRepliesOpen ? '▲' : '▼'}
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Nested Replies List (TikTok Threading with connector border) */}
                        {isRepliesOpen && repliesCount > 0 && (
                          <div className="mt-3.5 space-y-3 pl-3 md:pl-4 border-l-2 border-bdk-accent/30">
                            {comment.replies.map(reply => {
                              const replyAuthor = reply.author;
                              const replyAuthorName = getAuthorName(replyAuthor);
                              const replyInitial = getAuthorInitial(replyAuthor);
                              const isReplyOwn = isAuthorOrAdmin(replyAuthor);
                              const isReplyLiked = isLikedByUser(reply.likes);
                              const replyLikesCount = (reply.likes || []).length;

                              return (
                                <div key={reply._id} className="bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-xl border border-white/5 transition">
                                  <div className="flex items-start gap-2.5">
                                    {/* Small Avatar */}
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-bdk-accent to-emerald-400 text-bdk-dark font-black flex items-center justify-center text-[10px] flex-shrink-0 shadow">
                                      {replyAuthor?.avatar ? (
                                        <img src={replyAuthor.avatar} alt={replyAuthorName} className="w-full h-full rounded-full object-cover" />
                                      ) : (
                                        replyInitial
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1 mb-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="font-bold text-white text-xs">
                                            {replyAuthorName}
                                          </span>
                                          {replyAuthor?.role === 'admin' && (
                                            <span className="text-[9px] bg-bdk-accent/20 text-bdk-accent border border-bdk-accent/30 px-1 py-0.2 rounded font-black">
                                              ADMIN
                                            </span>
                                          )}
                                          <span className="text-[10px] text-gray-500">
                                            • {formatTimeAgo(reply.createdAt)}
                                          </span>
                                        </div>

                                        {/* Delete reply if author or admin */}
                                        {isReplyOwn && (
                                          <button
                                            onClick={() => handleDeleteReply(comment._id, reply._id)}
                                            title="Delete reply"
                                            className="text-gray-500 hover:text-red-400 text-[11px] p-0.5 transition"
                                          >
                                            🗑️
                                          </button>
                                        )}
                                      </div>

                                      {/* Text with @tag recipient */}
                                      <p className="text-gray-200 text-xs leading-relaxed break-words">
                                        {reply.replyToUser && (
                                          <span className="text-bdk-accent font-semibold mr-1.5">
                                            {reply.replyToUser}
                                          </span>
                                        )}
                                        {reply.text}
                                      </p>

                                      {/* Reply action row: Reply back + Heart like */}
                                      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400 font-semibold">
                                        <button
                                          onClick={() => handleStartReply(comment, replyAuthor)}
                                          className="hover:text-bdk-accent transition flex items-center gap-1"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                          </svg>
                                          <span>Reply</span>
                                        </button>

                                        <button
                                          onClick={() => handleLikeReply(comment._id, reply._id)}
                                          className={`flex items-center gap-1 transition ${
                                            isReplyLiked ? 'text-red-400 font-bold' : 'hover:text-red-400'
                                          }`}
                                        >
                                          <span>{isReplyLiked ? '❤️' : '🤍'}</span>
                                          <span>{replyLikesCount > 0 ? replyLikesCount : 'Like'}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Inline Reply Input (TikTok style attached directly to this comment thread) */}
                        {isReplyingThis && (
                          <form
                            onSubmit={(e) => handleSubmitReply(e, comment._id)}
                            className="mt-3.5 pl-3 md:pl-4 border-l-2 border-bdk-accent bg-white/[0.03] p-3 rounded-xl border-t border-r border-b border-white/10"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-bdk-accent font-semibold flex items-center gap-1">
                                Replying to <span className="underline">@{replyingTo.targetName}</span>
                              </span>
                              <button
                                type="button"
                                onClick={handleCancelReply}
                                className="text-gray-400 hover:text-white text-xs font-bold px-1 transition"
                              >
                                ✕ Cancel
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder={`Reply to @${replyingTo.targetName}...`}
                                autoFocus
                                maxLength="500"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-bdk-accent transition placeholder-gray-500"
                              />
                              <button
                                type="submit"
                                disabled={submittingReply || !replyText.trim()}
                                className="btn-primary py-2 px-4 rounded-xl text-xs font-bold disabled:opacity-40 flex-shrink-0 transition"
                              >
                                {submittingReply ? 'Sending...' : 'Reply'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <ClientFooter />
    </div>
  );
}

export default NewsArticle;
