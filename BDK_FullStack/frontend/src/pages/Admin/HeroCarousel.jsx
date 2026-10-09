import React, { useState, useEffect } from 'react';
import { heroEventAPI } from '../../services/api';
import ImageUploader from '../../components/Admin/ImageUploader';
import toast from 'react-hot-toast';

export default function AdminHeroCarousel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'hidden'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '🔥 Tana Derby',
    imageUrl: '',
    date: 'Sun, Nov 15 • 16:00 EAT',
    venue: "Bahir Dar Int'l Stadium",
    ticketPrice: 'From 50 ETB • VIP 200 ETB',
    badgeColor: 'gold',
    link: '/matches',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await heroEventAPI.getAllAdmin();
      setEvents(res.data.data || []);
    } catch (err) {
      console.error('Failed to load hero carousel events:', err);
      toast.error('Failed to load hero carousel cards');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title || '',
        category: event.category || 'Premier League',
        imageUrl: event.image?.url || '',
        date: event.date || 'Sun, Nov 15 • 16:00 EAT',
        venue: event.venue || "Bahir Dar Int'l Stadium",
        ticketPrice: event.ticketPrice || 'From 50 ETB',
        badgeColor: event.badgeColor || 'gold',
        link: event.link || '/matches',
        isActive: event.isActive !== undefined ? event.isActive : true,
        order: event.order || 0
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        category: '🏆 Premier League',
        imageUrl: '',
        date: 'Sun, Nov 15 • 16:00 EAT',
        venue: "Bahir Dar Int'l Stadium",
        ticketPrice: 'From 50 ETB • VIP 200 ETB',
        badgeColor: 'gold',
        link: '/matches',
        isActive: true,
        order: events.length + 1
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter an event or match title');
      return;
    }
    if (!formData.imageUrl.trim()) {
      toast.error('Please provide or upload an image');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        image: {
          url: formData.imageUrl,
          public_id: editingEvent?.image?.public_id || 'custom'
        },
        date: formData.date.trim(),
        venue: formData.venue.trim(),
        ticketPrice: formData.ticketPrice.trim(),
        badgeColor: formData.badgeColor,
        link: formData.link.trim(),
        isActive: formData.isActive,
        order: Number(formData.order) || 0
      };

      if (editingEvent) {
        const res = await heroEventAPI.update(editingEvent._id, payload);
        setEvents(prev => prev.map(ev => ev._id === editingEvent._id ? res.data.data : ev));
        toast.success('Hero card updated successfully!');
      } else {
        const res = await heroEventAPI.create(payload);
        setEvents(prev => [res.data.data, ...prev]);
        toast.success('New card added to hero carousel!');
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save card');
    } finally {
      setSaving(false);
    }
  };

  // Toggle single card active rotation in hero
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await heroEventAPI.toggleActive(id);
      const updated = res.data.data;
      setEvents(prev => prev.map(ev => ev._id === id ? updated : ev));
      toast.success(
        updated.isActive
          ? 'Card is now ROTATING in the hero carousel!'
          : 'Card is HIDDEN from hero carousel.'
      );
    } catch (err) {
      toast.error('Failed to toggle card visibility');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero card?')) return;
    try {
      await heroEventAPI.delete(id);
      setEvents(prev => prev.filter(ev => ev._id !== id));
      toast.success('Card removed from carousel');
    } catch (err) {
      toast.error('Failed to delete card');
    }
  };

  // Filtered cards
  const filteredEvents = events.filter(ev => {
    if (filter === 'active') return ev.isActive;
    if (filter === 'hidden') return !ev.isActive;
    return true;
  });

  const activeCount = events.filter(ev => ev.isActive).length;
  const hiddenCount = events.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <span>🎠</span> Hero Carousel Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Choose which match cards, events, and stadium banners rotate in the home page 3D carousel.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-primary py-2.5 px-5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <span>＋</span> Add Carousel Card
        </button>
      </div>

      {/* Overview Cards & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`cursor-pointer card-glass p-4 rounded-xl border transition ${
            filter === 'all' ? 'border-bdk-accent bg-bdk-accent/10 shadow-lg' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase font-black tracking-wider">All Cards</span>
            <span className="text-xl">🗂️</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">{events.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">Total hero cards in system</div>
        </div>

        <div
          onClick={() => setFilter('active')}
          className={`cursor-pointer card-glass p-4 rounded-xl border transition ${
            filter === 'active' ? 'border-emerald-400 bg-emerald-500/10 shadow-lg' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 uppercase font-black tracking-wider">Currently Rotating</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-2xl font-black text-white mt-1">{activeCount}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Live in Home 3D auto-scroll marquee</div>
        </div>

        <div
          onClick={() => setFilter('hidden')}
          className={`cursor-pointer card-glass p-4 rounded-xl border transition ${
            filter === 'hidden' ? 'border-yellow-400 bg-yellow-500/10 shadow-lg' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-yellow-400 uppercase font-black tracking-wider">Hidden / Paused</span>
            <span className="text-xl">⏸️</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">{hiddenCount}</div>
          <div className="text-[11px] text-gray-400 mt-1">Kept in database but not rotating</div>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <p className="text-4xl mb-3">🎠</p>
          <h3 className="text-lg font-bold text-white mb-1">No hero cards found</h3>
          <p className="text-xs text-gray-400 mb-4">
            {filter !== 'all' ? `No cards match the '${filter}' filter.` : 'Add your first rotating card to launch the hero marquee!'}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary py-2 px-4 rounded-lg text-xs font-bold"
          >
            Add New Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event._id}
              className={`card-glass rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                event.isActive
                  ? 'border-white/15 hover:border-bdk-accent/50 shadow-md'
                  : 'border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                {/* 16:9 Image Preview with floating badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={event.image?.url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp';
                    }}
                  />
                  {/* Floating Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-bdk-dark/80 backdrop-blur-md text-bdk-accent border border-bdk-accent/40 shadow-lg">
                      {event.category}
                    </span>
                  </div>

                  {/* Active Rotation Indicator */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border backdrop-blur-md flex items-center gap-1 ${
                        event.isActive
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-md'
                          : 'bg-black/70 text-gray-400 border-white/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${event.isActive ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                      {event.isActive ? 'Rotating' : 'Paused'}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 space-y-2.5">
                  <h3 className="font-black text-white text-base leading-snug line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📅</span>
                      <span className="truncate">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📍</span>
                      <span className="truncate text-gray-400">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">🎫</span>
                      <span className="text-bdk-accent font-semibold truncate">{event.ticketPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Controls & Rotation Toggle */}
              <div className="p-4 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                {/* 1-Click Toggle Rotation */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(event._id, event.isActive)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                    event.isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Click to toggle whether this card appears in the homepage carousel"
                >
                  <span>{event.isActive ? '✓ Rotating in Hero' : '○ Click to Rotate'}</span>
                </button>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(event)}
                    className="p-1.5 text-gray-400 hover:text-bdk-accent rounded-lg hover:bg-white/5 transition"
                    title="Edit card details"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                    title="Delete card"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-glass w-full max-w-xl rounded-2xl border border-white/15 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h2 className="text-xl font-black text-white">
                {editingEvent ? 'Edit Carousel Card' : 'Add New Carousel Card'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Uploader */}
              <ImageUploader
                label="Event / Match Card Image (16:9 Aspect Ratio Recommended)"
                value={formData.imageUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                fallback="/BDK_asset/club stadium/Stade-Bahir-Dar-et-annexe-Ethiopie-2.webp"
              />

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Event / Match Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Tana Derby: BDK vs Fasil Kenema"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-bdk-accent"
                />
              </div>

              {/* Category & Badge Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Category / Floating Badge</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. 🔥 Tana Derby or 🏆 EPL"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Badge Theme Color</label>
                  <select
                    value={formData.badgeColor}
                    onChange={e => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                    className="w-full bg-bdk-dark border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  >
                    <option value="gold">Gold (Derby & Featured)</option>
                    <option value="green">Green (Ethiopian Premier League)</option>
                    <option value="blue">Blue (CAF & Official Club)</option>
                    <option value="purple">Purple (Gala & Fan Zone)</option>
                    <option value="red">Red (Urgent / Live Fixture)</option>
                  </select>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Date & Time Pill</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. Sun, Nov 15 • 16:00 EAT"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Venue Location Pin</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="e.g. Bahir Dar Int'l Stadium"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>
              </div>

              {/* Ticket Price & Destination Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Ticket Price / Entry</label>
                  <input
                    type="text"
                    value={formData.ticketPrice}
                    onChange={e => setFormData(prev => ({ ...prev, ticketPrice: e.target.value }))}
                    placeholder="e.g. From 50 ETB • VIP 200 ETB"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Click Destination Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="e.g. /matches or /tickets"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>
              </div>

              {/* Active Toggle Switch in Form */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <span className="text-sm font-bold text-white block">Active in Hero Carousel</span>
                  <span className="text-xs text-gray-400">If checked, this image will rotate in the continuous right-to-left marquee.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2 px-6 rounded-xl text-sm font-black disabled:opacity-40"
                >
                  {saving ? 'Saving...' : editingEvent ? 'Update Card' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
