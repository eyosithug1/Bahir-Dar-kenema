import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function ClientShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState(['All', 'Jerseys', 'Training', 'Accessories', 'Fan Gear']);
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data.data || []);
      
      // If categories available from API
      try {
        const catRes = await productAPI.getCategories();
        if (catRes.data?.data?.length > 0) {
          setCategories(['All', ...catRes.data.data]);
        }
      } catch (err) {
        // use fallback categories
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load store products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const handleQuickOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      toast.error('Please enter your shipping address and phone number');
      return;
    }

    try {
      setOrdering(true);
      const orderData = {
        items: [
          {
            product: quickOrderProduct._id,
            quantity: orderQuantity,
            size: selectedSize,
            price: quickOrderProduct.price
          }
        ],
        shippingAddress: {
          street: shippingAddress,
          city: 'Bahir Dar',
          phone: phone
        },
        paymentMethod: 'Telebirr'
      };

      await orderAPI.create(orderData);
      toast.success('🎉 Order placed successfully! Check your account for tracking.');
      setQuickOrderProduct(null);
      setShippingAddress('');
      setPhone('');
      setOrderQuantity(1);
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-bdk-primary via-bdk-bg to-bdk-dark p-8 md:p-12 border border-white/10 shadow-2xl">
        <div className="max-w-2xl">
          <span className="text-xs font-black uppercase text-bdk-accent bg-bdk-accent/10 px-3 py-1 rounded-full border border-bdk-accent/30 tracking-wider">
            Official Store • Bahir Dar Kenema
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-3 tracking-tight">
            Wear The Waves Of Tana
          </h1>
          <p className="text-bdk-light text-base md:text-lg">
            Authentic match kits, training wear, flags, and official merchandise delivered right to your doorstep across Ethiopia.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-glass p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
                selectedCategory === category
                  ? 'bg-bdk-accent text-bdk-dark shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-bdk-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-bdk-accent"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card-glass p-12 text-center rounded-2xl border border-white/10">
          <div className="text-4xl mb-3">🛍️</div>
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-gray-400 text-sm">Try changing your search keywords or category filters.</p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="card-glass rounded-xl overflow-hidden border border-white/10 hover:border-bdk-accent/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="relative overflow-hidden bg-black/20 aspect-square">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-bdk-dark/50">
                      ⚽
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <span className="absolute top-3 left-3 bg-red-500/90 text-white text-[10px] font-black uppercase px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-bdk-dark/80 backdrop-blur-md text-bdk-accent text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-bdk-accent/30">
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white text-base group-hover:text-bdk-accent transition line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {product.description || 'Official Bahir Dar Kenema Football Club merchandise.'}
                  </p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl font-black text-bdk-accent">
                      {product.price} <span className="text-xs font-normal text-gray-300">ETB</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      Stock: <span className="text-white font-semibold">{product.stock}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  to={`/shop/${product._id}`}
                  className="w-full py-2 px-3 text-center bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition"
                >
                  Details
                </Link>
                <button
                  onClick={() => {
                    setQuickOrderProduct(product);
                    setOrderQuantity(1);
                  }}
                  disabled={product.stock <= 0}
                  className="w-full py-2 px-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark rounded-lg text-xs font-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Order Modal */}
      {quickOrderProduct && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-glass border border-bdk-accent/40 rounded-2xl max-w-md w-full p-6 relative shadow-2xl bg-bdk-dark">
            <button
              onClick={() => setQuickOrderProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-white mb-1">Quick Checkout</h2>
            <p className="text-xs text-gray-400 mb-4">Complete your order for {quickOrderProduct.name}</p>

            <form onSubmit={handleQuickOrder} className="space-y-4">
              <div className="flex gap-4 items-center p-3 bg-white/5 rounded-xl border border-white/10">
                {quickOrderProduct.images && quickOrderProduct.images[0] && (
                  <img
                    src={quickOrderProduct.images[0].url}
                    alt={quickOrderProduct.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-bold text-white text-sm">{quickOrderProduct.name}</h4>
                  <p className="text-bdk-accent font-black text-sm">{quickOrderProduct.price} ETB</p>
                </div>
              </div>

              {quickOrderProduct.sizes && quickOrderProduct.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Select Size</label>
                  <div className="flex gap-2">
                    {quickOrderProduct.sizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          selectedSize === size
                            ? 'bg-bdk-accent text-bdk-dark'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-white font-bold text-sm w-6 text-center">{orderQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.min(quickOrderProduct.stock, orderQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-400 ml-auto">
                    Total: <strong className="text-bdk-accent">{quickOrderProduct.price * orderQuantity} ETB</strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Shipping Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kebele 14, Near Stadium, Bahir Dar"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Phone Number (Telebirr/CBE)</label>
                <input
                  type="tel"
                  required
                  placeholder="+251 9XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-bdk-accent"
                />
              </div>

              <button
                type="submit"
                disabled={ordering}
                className="w-full py-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl transition shadow-lg mt-4 disabled:opacity-50"
              >
                {ordering ? 'Placing Order...' : `Confirm & Pay ${quickOrderProduct.price * orderQuantity} ETB`}
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

export default ClientShop;
