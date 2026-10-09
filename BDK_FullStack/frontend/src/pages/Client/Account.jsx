import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { orderAPI, ticketAPI, userAPI } from '../../services/api';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import ClientFooter from '../../components/Client/ClientFooter';

function ClientAccount() {
  const { user, logout, getMe } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'tickets' | 'profile' | 'security'

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    street: '',
    city: '',
    postalCode: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    loadMyOrders();
    loadMyTickets();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        street: user.deliveryAddress?.street || '',
        city: user.deliveryAddress?.city || 'Bahir Dar',
        postalCode: user.deliveryAddress?.postalCode || '6000'
      });
    }
  }, [user]);

  const loadMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.data || []);
    } catch {
      // quiet fallback
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadMyTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await ticketAPI.getMyBookings();
      setTickets(res.data.data || []);
    } catch {
      // quiet fallback
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      loadMyOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await userAPI.updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        bio: profileForm.bio,
        deliveryAddress: {
          street: profileForm.street,
          city: profileForm.city,
          postalCode: profileForm.postalCode
        }
      });
      await getMe();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSavingPass(true);
      await userAPI.updatePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      toast.success('Password updated successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-bold">Shipped 🚚</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2.5 py-1 rounded-full font-bold">Cancelled</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-bold">Processing ⏳</span>;
    }
  };

  const displayName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User');

  return (
    <div className="min-h-screen bg-bdk-bg flex flex-col justify-between">
      <ClientNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Profile Header Banner */}
        <div className="card-glass p-6 md:p-8 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-bdk-primary via-bdk-bg to-bdk-accent text-white font-black text-3xl flex items-center justify-center shadow-lg border border-white/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-black text-white">{displayName}</h1>
                <span className="bg-bdk-accent/20 text-bdk-accent border border-bdk-accent/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  {user?.role === 'admin' ? 'Club Administrator' : 'Waves Supporter'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              {user?.phone && <p className="text-gray-400 text-xs mt-0.5">📞 {user.phone}</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2.5 bg-bdk-accent text-bdk-dark font-black text-xs rounded-xl shadow hover:bg-yellow-400 transition"
              >
                Admin Dashboard ⚡
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs rounded-xl transition border border-red-500/30"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 mb-6 gap-6 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-bold transition whitespace-nowrap relative ${
              activeTab === 'orders' ? 'text-bdk-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            📦 My Store Orders ({orders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bdk-accent"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 font-bold transition whitespace-nowrap relative ${
              activeTab === 'tickets' ? 'text-bdk-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            🎟️ Match Tickets ({tickets.length})
            {activeTab === 'tickets' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bdk-accent"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-bold transition whitespace-nowrap relative ${
              activeTab === 'profile' ? 'text-bdk-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            👤 Edit Profile & Address
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bdk-accent"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 font-bold transition whitespace-nowrap relative ${
              activeTab === 'security' ? 'text-bdk-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            🔒 Password & Security
            {activeTab === 'security' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-bdk-accent"></span>
            )}
          </button>
        </div>

        {/* TAB 1: STORE ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="flex justify-center items-center h-48"><div className="spinner"></div></div>
            ) : orders.length === 0 ? (
              <div className="card-glass p-12 text-center text-gray-400 rounded-2xl border border-white/10">
                <p className="text-3xl mb-3">🛍️</p>
                <h3 className="text-lg font-bold text-white mb-1">No Orders Placed Yet</h3>
                <p className="text-xs mb-6">Discover the official jerseys and team accessories in our club shop.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 bg-bdk-accent text-bdk-dark font-black text-xs rounded-xl hover:bg-yellow-400 transition"
                >
                  Visit Official Store
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="card-glass p-5 md:p-6 rounded-2xl border border-white/10 hover:border-white/20 transition">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-xs font-mono font-bold text-bdk-accent block">
                          Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <span className="text-base font-black text-white">
                          {(order.totalPrice || order.totalAmount || 0).toLocaleString()} ETB
                        </span>
                      </div>
                    </div>

                    <div className="py-4 space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {item.product?.images?.[0]?.url ? (
                              <img src={item.product.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover bg-black/30" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-lg">⚽</div>
                            )}
                            <div>
                              <p className="font-bold text-white text-sm">{item.product?.name || item.name || 'Official Item'}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-sm text-gray-200">
                            {(item.price * item.quantity).toLocaleString()} ETB
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                      <span>📍 Delivery: {order.deliveryAddress?.street || order.shippingAddress?.street || 'Bahir Dar City'}</span>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-red-400 hover:text-red-300 font-bold transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIGITAL MATCH TICKETS */}
        {activeTab === 'tickets' && (
          <div>
            {loadingTickets ? (
              <div className="flex justify-center items-center h-48"><div className="spinner"></div></div>
            ) : tickets.length === 0 ? (
              <div className="card-glass p-12 text-center text-gray-400 rounded-2xl border border-white/10">
                <p className="text-3xl mb-3">🎟️</p>
                <h3 className="text-lg font-bold text-white mb-1">No Stadium Tickets Booked</h3>
                <p className="text-xs mb-6">Support the Blue Army at Bahir Dar International Stadium.</p>
                <button
                  onClick={() => navigate('/matches')}
                  className="px-6 py-2.5 bg-bdk-accent text-bdk-dark font-black text-xs rounded-xl hover:bg-yellow-400 transition"
                >
                  View Upcoming Matches
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="card-glass p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
                    <div className="border-b border-white/10 pb-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase bg-bdk-accent/20 text-bdk-accent px-2.5 py-0.5 rounded-full">
                          {ticket.tierName || 'Regular Stand'}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {ticket.status?.toUpperCase() || 'CONFIRMED'}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        {ticket.match?.homeTeam || 'Bahir Dar Kenema'} vs {ticket.match?.awayTeam || 'Opposition'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        📍 Bahir Dar International Stadium • {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Gate Pass Code</span>
                        <span className="font-mono font-bold text-sm text-bdk-accent tracking-wider">
                          {ticket.bookingReference}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block uppercase">Quantity</span>
                        <span className="font-bold text-sm text-white">{ticket.quantity} Tickets</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EDIT PROFILE & DELIVERY ADDRESS */}
        {activeTab === 'profile' && (
          <div className="card-glass p-6 md:p-8 rounded-2xl border border-white/10 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Edit Profile Details</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                  placeholder="0911223344"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Fan Bio / Chants</label>
                <textarea
                  rows="2"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm"
                  placeholder="Proud member of the Blue Army..."
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-bold text-bdk-accent uppercase tracking-wider mb-3">Delivery Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Street / Kebele</label>
                    <input
                      type="text"
                      value={profileForm.street}
                      onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                      placeholder="Kebele 04, near stadium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={profileForm.postalCode}
                        onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl transition text-sm mt-4 shadow-lg"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: PASSWORD & SECURITY */}
        {activeTab === 'security' && (
          <div className="card-glass p-6 md:p-8 rounded-2xl border border-white/10 max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">New Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingPass}
                className="w-full py-3 bg-bdk-accent hover:bg-yellow-400 text-bdk-dark font-black rounded-xl transition text-sm mt-4 shadow-lg"
              >
                {savingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
      <ClientFooter />
    </div>
  );
}

export default ClientAccount;
