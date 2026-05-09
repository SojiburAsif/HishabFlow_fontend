'use client';

import React from 'react';
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { Search, Eye, Printer, AlertCircle } from 'lucide-react';
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

export default function DashboardOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/order`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        const orderList = Array.isArray(data) ? data : data.data || [];
        setOrders(orderList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  React.useEffect(() => {
    let filtered = orders;
    if (searchQuery) {
      filtered = filtered.filter(
        o => o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'processing': return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'shipped': return 'bg-purple-900/30 text-purple-300 border-purple-700';
      case 'delivered': return 'bg-green-900/30 text-green-300 border-green-700';
      case 'cancelled': return 'bg-red-900/30 text-red-300 border-red-700';
      default: return 'bg-zinc-800 text-zinc-300';
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <>
      <DashboardRoutePage
        title="Orders"
        description="Track order flow, recent sales, and fulfillment status from one place."
        badge="Shop Flow"
        accent="from-amber-500 to-orange-500"
      />

      <div className="mt-8 space-y-6">
        {pendingCount > 0 && (
          <div className="rounded-[2rem] border-l-4 border-l-amber-500 border border-zinc-800 bg-amber-950/30 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-300">{pendingCount} pending orders</p>
                <p className="text-sm text-amber-200">Orders awaiting processing</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by order number or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/50">
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Order #</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Items</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Total</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Date</th>
                  <th className="px-6 py-4 text-right font-semibold text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">Loading orders...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-red-400">{error}</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">No orders found</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-800 hover:bg-black/50 transition">
                      <td className="px-6 py-4 font-mono text-purple-400">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-white">{order.customerName}</td>
                      <td className="px-6 py-4 text-white">{order.items} items</td>
                      <td className="px-6 py-4 font-semibold text-white">${order.total?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 border text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-black/50 rounded-lg transition text-zinc-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-black/50 rounded-lg transition text-zinc-400 hover:text-white">
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
