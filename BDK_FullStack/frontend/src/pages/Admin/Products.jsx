import React, { useEffect, useState } from 'react';
import { productAPI } from '../../services/api';
import ImageUploader from '../../components/Admin/ImageUploader';
import toast from 'react-hot-toast';

const CATEGORIES = ['Jerseys', 'Training Wear', 'Accessories', 'Fan Gear', 'Footwear', 'Other'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  discount: 0,
  category: 'Jerseys',
  stock: 20,
  sizes: ['S', 'M', 'L', 'XL'],
  image: '/BDK_asset/club jerssey/1ndkit (1).webp'
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    const primaryImg = (product.images && product.images[0]?.url) || product.image || '/BDK_asset/club jerssey/1ndkit (1).webp';
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || 0,
      category: product.category || 'Jerseys',
      stock: product.stock !== undefined ? product.stock : 20,
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      image: primaryImg
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Product name and price are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        discount: Number(formData.discount || 0),
        category: formData.category,
        stock: Number(formData.stock || 0),
        sizes: formData.sizes,
        image: formData.image,
        images: [{ url: formData.image, public_id: 'custom' }]
      };

      if (editProduct) {
        await productAPI.update(editProduct._id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created successfully!');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Store & Merchandise Management</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage inventory, prices, images and official kits</p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md"
        >
          <span>+</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="card-glass p-4 rounded-xl mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between border border-white/10">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
        />
        <div className="text-xs text-gray-400 font-semibold">
          Total Products: <span className="text-bdk-accent font-bold">{products.length}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="card-glass p-6 rounded-2xl border border-white/10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(product => {
              const imgUrl = (product.images && product.images[0]?.url) || product.image || '/BDK_asset/club jerssey/1ndkit (1).webp';
              return (
                <div
                  key={product._id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-bdk-accent/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-black/30">
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => { e.target.src = '/BDK_asset/club jerssey/1ndkit (1).webp'; }}
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          -{product.discount}%
                        </span>
                      )}
                      <span className="absolute top-2 right-2 bg-bdk-dark/80 backdrop-blur-md text-bdk-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-bdk-accent/30 uppercase">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-bdk-accent transition">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {product.description || 'Authentic BDK gear'}
                      </p>

                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-base font-black text-bdk-accent">
                          {product.price} <span className="text-[11px] font-normal text-gray-300">ETB</span>
                        </span>
                        <span className="text-xs text-gray-400">
                          Stock: <span className="text-white font-semibold">{product.stock}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-bold rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass bg-bdk-dark border border-white/20 rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-white font-heading mb-1">
              {editProduct ? `Edit Product: ${editProduct.name}` : 'Add New Merchandise Item'}
            </h2>
            <p className="text-xs text-gray-400 mb-6">Set merchandise details, price, inventory and photo</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BDK Official Home Kit 2026"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-bdk-bg border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Universal Image Uploader */}
              <ImageUploader
                value={formData.image}
                onChange={(img) => setFormData(p => ({ ...p, image: img }))}
                label="Product Merchandise Image"
                fallback="/BDK_asset/club jerssey/1ndkit (1).webp"
              />

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe fabric, fit, design motifs and authentic club badges..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-bdk-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Price (ETB) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="850"
                    value={formData.price}
                    onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.discount}
                    onChange={e => setFormData(p => ({ ...p, discount: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formData.stock}
                    onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">Available Sizes</label>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map(s => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                        formData.sizes.includes(s)
                          ? 'bg-bdk-accent text-bdk-dark border-bdk-accent'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  {submitting ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
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

export default AdminProducts;
