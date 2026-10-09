import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getById(id);
      setProduct(res.data.data || res.data);
      if (res.data?.data?.sizes?.length > 0) {
        setSelectedSize(res.data.data.sizes[0]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      toast.error('Please enter complete delivery information');
      return;
    }

    try {
      setIsOrdering(true);
      const orderPayload = {
        items: [
          {
            product: product._id,
            quantity: quantity,
            size: selectedSize,
            price: product.price
          }
        ],
        shippingAddress: {
          street: shippingAddress,
          city: 'Bahir Dar',
          phone: phone
        },
        paymentMethod: 'Telebirr'
      };

      await orderAPI.create(orderPayload);
      toast.success('Order placed successfully! We will contact you for delivery.');
      setOrderModalOpen(false);
      navigate('/account');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error(error.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="card-glass p-12 rounded-2xl max-w-lg mx-auto border border-white/10">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-2xl font-black text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">The item you are looking for might be out of stock or removed.</p>
          <Link to="/shop" className="btn-primary px-6 py-2.5 rounded-lg text-sm font-bold inline-block">
            Back to Official Store
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://via.placeholder.com/600x600?text=Bahir+Dar+Kenema' }];

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-white transition">Shop</Link>
        <span>/</span>
        <span className="text-bdk-accent truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 card-glass p-6 md:p-10 rounded-2xl border border-white/10">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
            <img
              src={images[activeImageIndex]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock <= 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg">
                Sold Out
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-bdk-accent scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-bdk-accent bg-bdk-accent/10 px-3 py-1 rounded-full border border-bdk-accent/30">
                {product.category || 'Official Merchandise'}
              </span>
              <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `● In Stock (${product.stock} available)` : '● Out of Stock'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mt-3 mb-4 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-bdk-accent">
                {product.price} <span className="text-base font-medium text-gray-300">ETB</span>
              </span>
              <span className="text-xs text-gray-400">VAT & Official Licensing Included</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 border-b border-white/10 pb-6">
              {product.description || 'Authentic Bahir Dar Kenema FC official sports gear crafted with high-performance breathable fabrics.'}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-gray-300 tracking-wider">Select Size</label>
                  <span className="text-xs text-bdk-accent cursor-pointer hover:underline">Size Chart</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-11 px-4 rounded-xl font-black text-xs transition flex items-center justify-center border ${
                        selectedSize === size
                          ? 'bg-bdk-accent text-bdk-dark border-bdk-accent shadow-lg shadow-bdk-accent/20'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase text-gray-300 tracking-wider mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="text-white font-black text-base w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    disabled={product.stock <= quantity}
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  Subtotal: <span className="text-white font-bold text-sm">{(product.price * quantity).toLocaleString()} ETB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <button
              onClick={() => setOrderModalOpen(true)}
              disabled={product.stock <= 0}
              className="w-full py-4 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black text-base rounded-xl transition shadow-xl shadow-bdk-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>⚡ Order Now with Fast Delivery</span>
            </button>
            <div className="grid grid-cols-3 gap-3 text-center pt-4 text-xs text-gray-400">
              <div className="p-2 rounded-lg bg-white/5">
                <span className="block text-base mb-1">🛡️</span>
                <span>100% Authentic</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="block text-base mb-1">🚚</span>
                <span>Fast Ethiopian Delivery</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="block text-base mb-1">💳</span>
                <span>Telebirr / CBE Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card-glass border border-bdk-accent/40 rounded-2xl max-w-md w-full p-6 relative shadow-2xl bg-bdk-dark">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-white mb-1">Checkout Summary</h2>
            <p className="text-xs text-gray-400 mb-4">Complete your direct delivery details below</p>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{product.name} (x{quantity})</span>
                  <span className="text-white font-bold">{product.price * quantity} ETB</span>
                </div>
                {selectedSize && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Size</span>
                    <span className="font-bold text-bdk-accent">{selectedSize}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-black">
                  <span className="text-white">Total Amount</span>
                  <span className="text-bdk-accent">{product.price * quantity} ETB</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street / Kebele / City (e.g. Bahir Dar / Addis Ababa)"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Phone Number for Verification</label>
                <input
                  type="tel"
                  required
                  placeholder="0911000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <div className="p-3 rounded-lg bg-bdk-accent/10 border border-bdk-accent/20 text-xs text-bdk-light">
                ℹ️ Our sales team will call you to confirm delivery and send payment instructions.
              </div>

              <button
                type="submit"
                disabled={isOrdering}
                className="w-full py-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl transition shadow-lg disabled:opacity-50"
              >
                {isOrdering ? 'Processing Order...' : `Confirm Order (${product.price * quantity} ETB)`}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
      <ClientFooter />
    </div>
  );
}

export default ProductDetail;
