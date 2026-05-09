'use client';

import React from 'react';
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { AlertTriangle, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

interface InventoryItem {
  id: string;
  name?: string;
  productName?: string;
  sku: string;
  stock?: number;
  currentStock?: number;
  reorderLevel?: number;
  category?: string;
  lastRestockDate?: string;
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export default function DashboardInventoryPage() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stockLevel, setStockLevel] = React.useState('all');

  React.useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/product`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch inventory');
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.data || [];
        setInventory(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const lowStockItems = inventory.filter(item => {
    const stock = item.stock ?? item.currentStock ?? 0;
    return stock < 10;
  });
  const outOfStockItems = inventory.filter(item => {
    const stock = item.stock ?? item.currentStock ?? 0;
    return stock === 0;
  });
  const normalStockItems = inventory.filter(item => {
    const stock = item.stock ?? item.currentStock ?? 0;
    return stock >= 10;
  });

  const getFilteredItems = () => {
    switch (stockLevel) {
      case 'low': return lowStockItems;
      case 'out': return outOfStockItems;
      case 'normal': return normalStockItems;
      default: return inventory;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <>
      <DashboardRoutePage
        title="Inventory"
        description="Monitor stock levels, low inventory alerts, and product movement."
        badge="Stock"
        accent="from-cyan-500 to-sky-500"
      />

      <div className="mt-8 space-y-6">
        {/* Stock Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total Products */}
          <div className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-cyan-950/50 to-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Products</p>
                <p className="mt-2 text-3xl font-bold text-white">{inventory.length}</p>
              </div>
              <Package className="h-10 w-10 text-cyan-500" />
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-amber-950/50 to-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Low Stock (&lt;10)</p>
                <p className="mt-2 text-3xl font-bold text-amber-400">{lowStockItems.length}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-amber-500" />
            </div>
          </div>

          {/* Out of Stock */}
          <div className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-red-950/50 to-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Out of Stock</p>
                <p className="mt-2 text-3xl font-bold text-red-400">{outOfStockItems.length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {outOfStockItems.length > 0 && (
          <div className="rounded-[2rem] border-l-4 border-l-red-500 border border-zinc-800 bg-red-950/30 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold text-red-300">{outOfStockItems.length} products out of stock</p>
                <p className="text-sm text-red-200">Immediate reordering required</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-300">Filter:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All Items' },
                { value: 'normal', label: 'Normal Stock' },
                { value: 'low', label: 'Low Stock' },
                { value: 'out', label: 'Out of Stock' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setStockLevel(filter.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    stockLevel === filter.value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-black/50 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/50">
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Product</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">SKU</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Current Stock</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Reorder Level</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Last Restock</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-400">Loading inventory...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-red-400">{error}</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-400">No inventory items found</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const stock = item.stock ?? item.currentStock ?? 0;
                    const stockStatus = stock === 0 
                      ? 'out-of-stock' 
                      : stock < 10 
                      ? 'low-stock' 
                      : 'in-stock';
                    
                    const statusColor = stockStatus === 'out-of-stock'
                      ? 'bg-red-900/30 text-red-300'
                      : stockStatus === 'low-stock'
                      ? 'bg-amber-900/30 text-amber-300'
                      : 'bg-green-900/30 text-green-300';

                    return (
                      <tr key={item.id} className="border-b border-zinc-800 hover:bg-black/50 transition">
                        <td className="px-6 py-4 font-medium text-white">{item.name || item.productName}</td>
                        <td className="px-6 py-4 font-mono text-zinc-400">{item.sku}</td>
                        <td className="px-6 py-4 text-white font-semibold">{stock}</td>
                        <td className="px-6 py-4 text-zinc-400">{item.reorderLevel || 10}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor}`}>
                            {stockStatus.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">{item.lastRestockDate ? new Date(item.lastRestockDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
