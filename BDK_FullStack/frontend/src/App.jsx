import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';

// Client Pages
import ClientHome from './pages/Client/Home';
import ClientNews from './pages/Client/News';
import ClientShop from './pages/Client/Shop';
import ClientFanWall from './pages/Client/FanWall';
import ClientAccount from './pages/Client/Account';
import ClientMatches from './pages/Client/Matches';
import ClientSquad from './pages/Client/Squad';
import NewsArticle from './pages/Client/NewsArticle';
import ProductDetail from './pages/Client/ProductDetail';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminHeroCarousel from './pages/Admin/HeroCarousel';
import AdminNews from './pages/Admin/News';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminLiveScores from './pages/Admin/LiveScores';
import AdminUsers from './pages/Admin/Users';
import AdminComments from './pages/Admin/Comments';
import AdminPlayers from './pages/Admin/Players';
import AdminTickets from './pages/Admin/Tickets';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, isInitialized, isLoading } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present but user profile is still loading on initial page render, show loader
  if (!user && (isLoading || !isInitialized)) {
    return (
      <div className="min-h-screen bg-bdk-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-blue-200 text-sm font-bold">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { getMe, setToken } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      getMe();
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<ClientHome />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Client Pages */}
        <Route path="/matches" element={<ClientMatches />} />
        <Route path="/squad" element={<ClientSquad />} />
        <Route path="/news" element={<ClientNews />} />
        <Route path="/news/:id" element={<NewsArticle />} />
        <Route path="/shop" element={<ClientShop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/fan-wall" element={<ClientFanWall />} />

        {/* Protected Client Pages */}
        <Route path="/account" element={
          <ProtectedRoute>
            <ClientAccount />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/hero-carousel" element={<AdminHeroCarousel />} />
                  <Route path="/news" element={<AdminNews />} />
                  <Route path="/products" element={<AdminProducts />} />
                  <Route path="/orders" element={<AdminOrders />} />
                  <Route path="/tickets" element={<AdminTickets />} />
                  <Route path="/live-scores" element={<AdminLiveScores />} />
                  <Route path="/players" element={<AdminPlayers />} />
                  <Route path="/users" element={<AdminUsers />} />
                  <Route path="/comments" element={<AdminComments />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
