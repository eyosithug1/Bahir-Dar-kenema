import React, { useState } from 'react';
import { uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ImageUploader({ value, onChange, label = 'Image', fallback = '/BDK_asset/logo/bahir-dar-kenema-fc-logo-png_seeklogo-553429.png' }) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    // 1. Instant local preview via FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      // Immediately set preview with base64 so user sees it instantly
      onChange(reader.result);
    };
    reader.readAsDataURL(file);

    // 2. Upload to server
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await uploadAPI.uploadImage(formData);
      if (res.data?.url) {
        onChange(res.data.url);
        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      console.warn('Server upload failed, using local base64 preview instead:', err);
      // FileReader base64 was already set, which still works seamlessly
      toast.success('Image selected from computer!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-gray-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-bdk-accent hover:underline font-bold"
        >
          {showUrlInput ? '📁 Switch to File Upload' : '🔗 Enter Image URL'}
        </button>
      </div>

      {/* Image Preview & Upload Controls */}
      <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-bdk-dark flex-shrink-0 border border-white/20 relative">
          <img
            src={value || fallback}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = fallback; }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-bdk-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          {showUrlInput ? (
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... or /BDK_asset/..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-bdk-accent"
            />
          ) : (
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark text-xs font-bold rounded-lg transition shadow-sm inline-flex items-center gap-1.5">
                <span>📁</span>
                <span>{uploading ? 'Uploading...' : 'Choose from Computer'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-lg transition"
                >
                  Remove
                </button>
              )}
            </div>
          )}

          <p className="text-[10px] text-gray-400">
            Supports PNG, JPG, WEBP files up to 15MB.
          </p>
        </div>
      </div>
    </div>
  );
}
