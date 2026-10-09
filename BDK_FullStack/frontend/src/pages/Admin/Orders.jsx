import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Orders Management</h1>
        <p className="text-gray-400 mt-2">Total Orders: {orders.length}</p>
      </div>

      {/* Orders Table */}
      <div className="card-glass p-6 rounded-xl">
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-4 font-mono text-sm text-bdk-accent">
                      {order.orderNumber?.slice(0, 12)}
                    </td>
                    <td className="px-4 py-4 text-white font-medium">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {order.customerPhone}
                    </td>
                    <td className="px-4 py-4 font-bold text-bdk-accent">
                      {order.totalPrice} Br
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border cursor-pointer ${
                          order.status === 'pending' ? 'border-orange-500 text-orange-400' :
                          order.status === 'confirmed' ? 'border-blue-500 text-blue-400' :
                          order.status === 'shipped' ? 'border-indigo-500 text-indigo-400' :
                          order.status === 'delivered' ? 'border-green-500 text-green-400' :
                          'border-red-500 text-red-400'
                        }`}
                      >
                        <option value="pending" className="bg-slate-900 text-white">Pending</option>
                        <option value="confirmed" className="bg-slate-900 text-white">Confirmed</option>
                        <option value="shipped" className="bg-slate-900 text-white">Shipped</option>
                        <option value="delivered" className="bg-slate-900 text-white">Delivered</option>
                        <option value="cancelled" className="bg-slate-900 text-white">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        className="text-bdk-light hover:text-bdk-accent transition-colors text-sm font-bold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card-glass p-8 rounded-xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-mono">{selectedOrder.orderNumber}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Customer</p>
                <p className="text-white">
                  {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                </p>
                <p className="text-gray-400 text-sm">{selectedOrder.customer?.email}</p>
                <p className="text-bdk-accent font-bold">{selectedOrder.customerPhone}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Delivery Address</p>
                <p className="text-white">
                  {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Items Ordered</p>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-white/10 p-3 rounded-lg">
                      <p className="text-white">{item.product?.name}</p>
                      <p className="text-gray-400 text-sm">
                        Qty: {item.quantity} x {item.price} Br = {item.quantity * item.price} Br
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xl font-bold text-bdk-accent">
                  Total: {selectedOrder.totalPrice} Br
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full btn-secondary mt-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
