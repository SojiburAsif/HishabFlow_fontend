'use client';

import React from 'react';
import DashboardRoutePage from "@/components/shared/dashboard/DashboardRoutePage";
import { Plus, Package, Search, MoreVertical, Edit2, Trash2, Eye, AlertCircle } from 'lucide-react';
import { publicEnv } from "@/lib/env";

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  status: 'active' | 'inactive';
  image?: string;
}

export default function DashboardProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/product`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.data || [];
        setProducts(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  React.useEffect(() => {
    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter(
        p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const lowStockCount = products.filter(p => p.stock && p.stock < 10).length;

  return (
    <>
      <DashboardRoutePage
        title="Products"
        description="Manage product catalog, pricing, and inventory from this page."
        badge="Catalog"
        accent="from-violet-500 to-fuchsia-500"
      />

      <div className="mt-8 space-y-6">
        {/* Header with Add Product Button */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Product Inventory</h3>
              <p className="mt-1 text-sm text-zinc-400">Manage all your products, pricing, and stock levels</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50">
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <div className="rounded-[2rem] border-l-4 border-l-amber-500 border border-zinc-800 bg-amber-950/30 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-semibold text-amber-300">{lowStockCount} products with low stock</p>
                <p className="text-sm text-amber-200">Consider reordering items running low</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/50 pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-black/50 px-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-black/50">
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Product Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">SKU</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Category</th>
                  <th className="px-6 py-4 text-right font-semibold text-zinc-300">Price</th>
                  <th className="px-6 py-4 text-center font-semibold text-zinc-300">Stock</th>
                  <th className="px-6 py-4 text-left font-semibold text-zinc-300">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">Loading products...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-red-400">{error}</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-zinc-900 p-4">
                          <Package className="h-8 w-8 text-zinc-600" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-white">No Products Found</h3>
                        <p className="text-sm text-zinc-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-zinc-800 hover:bg-black/50 transition">
                      <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                      <td className="px-6 py-4 font-mono text-zinc-400">{product.sku}</td>
                      <td className="px-6 py-4 text-zinc-400">{product.category || 'Uncategorized'}</td>
                      <td className="px-6 py-4 text-right font-semibold text-white">${product.price?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? 'bg-red-900/30 text-red-300'
                            : product.stock < 10
                            ? 'bg-amber-900/30 text-amber-300'
                            : 'bg-green-900/30 text-green-300'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          product.status === 'active'
                            ? 'bg-emerald-900/30 text-emerald-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {product.status || 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-black/50 rounded-lg transition text-zinc-400 hover:text-white" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-black/50 rounded-lg transition text-zinc-400 hover:text-white" title="Edit">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-black/50 rounded-lg transition text-zinc-400 hover:text-red-400" title="Delete">
                            <Trash2 className="h-4 w-4" />
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
