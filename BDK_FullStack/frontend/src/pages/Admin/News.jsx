import React, { useEffect, useState } from 'react';
import { newsAPI } from '../../services/api';
import ImageUploader from '../../components/Admin/ImageUploader';
import toast from 'react-hot-toast';

const emptyNewsForm = {
  title: '',
  description: '',
  content: '',
  category: 'News',
  tags: 'EPL, BDK',
  featuredImage: ''
};

function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(emptyNewsForm);
  const [submitting, setSubmitting] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getAll();
      setNews(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setFormData(emptyNewsForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      content: item.content || '',
      category: item.category || 'News',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      featuredImage: item.featuredImage?.url || item.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await newsAPI.delete(id);
      toast.success('Article deleted');
      loadNews();
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Headline and content are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage
      };

      if (editItem) {
        await newsAPI.update(editItem._id, payload);
        toast.success('Article updated successfully!');
      } else {
        await newsAPI.create(payload);
        toast.success('Article published successfully!');
      }

      setShowModal(false);
      setFormData(emptyNewsForm);
      loadNews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save news article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">News & Articles Management</h1>
          <p className="text-gray-400 mt-1 text-sm">Publish and edit press releases, match reports, and media updates</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md">
          <span>+</span>
          <span>Publish Article</span>
        </button>
      </div>

      <div className="card-glass p-6 rounded-2xl border border-white/10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner"></div></div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No news articles found. Create your first club story!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-bdk-dark flex-shrink-0 border border-white/10">
                          <img
                            src={item.featuredImage?.url || item.image || '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp'; }}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm line-clamp-1">{item.title}</h4>
                          <p className="text-gray-400 text-xs line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold">
                      <span className="bg-white/10 text-bdk-light px-2.5 py-1 rounded-full border border-white/10">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-bdk-accent font-bold text-sm">{item.viewCount || 0}</td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="py-1 px-3 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-bold rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="py-1 px-3 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit News Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark p-6 sm:p-8 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white font-heading">
                {editItem ? 'Edit News Article' : 'Publish News Article'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Historic Derby Victory over Fasil Kenema"
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-bdk-bg border border-white/20 text-white text-sm focus:outline-none focus:border-bdk-accent"
                >
                  <option value="News">News</option>
                  <option value="Match Report">Match Report</option>
                  <option value="Update">Update</option>
                  <option value="Interview">Interview</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                value={formData.featuredImage}
                onChange={(img) => setFormData({ ...formData, featuredImage: img })}
                label="Article Featured Image"
                fallback="/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Summary / Lead Excerpt</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview"
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="EPL, Lake Tana, Victory"
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Article Content</label>
                <textarea
                  rows="5"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full report here..."
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-bdk-accent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  {submitting ? 'Saving...' : (editItem ? 'Save Changes' : 'Publish Article')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-3 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNews;
