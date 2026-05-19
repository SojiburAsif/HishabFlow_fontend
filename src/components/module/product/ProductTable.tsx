'use client';

import React, { useState } from 'react';
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from '@heroui/react';
import { MoreVertical, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ProductTableRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface ProductTableProps {
  products: ProductTableRow[];
  onEdit: (product: ProductTableRow) => void;
  onDelete: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const itemsPerPage = 10;

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'success';
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 shadow-xl shadow-zinc-200/20 dark:shadow-none"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Inventory List
        </h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
            
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">Product</th>
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">SKU</th>
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">Category</th>
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">Price</th>
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">Stock</th>
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">Status</th>
              <th className="bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {currentItems.map((product) => (
              <tr key={product.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-linear-to-br from-purple-500/10 to-pink-500/10">
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-sm text-zinc-600 dark:text-zinc-400">{product.sku}</td>
                <td className="px-4 py-4">
                  <Chip size="sm" variant="soft" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {product.category}
                  </Chip>
                </td>
                <td className="px-4 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  ${product.price.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-zinc-600 dark:text-zinc-400">{product.quantity}</td>
                <td className="px-4 py-4">
                  <Chip
                    color={getStatusColor(product.status)}
                    size="sm"
                    variant="soft"
                    className="capitalize"
                  >
                    {product.status.replace('-', ' ')}
                  </Chip>
                </td>
                <td className="px-4 py-4">
                  <Dropdown>
                    <DropdownTrigger aria-label="Product actions">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-purple-600">
                        <MoreVertical className="h-4 w-4" />
                      </span>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Product actions">
                      <DropdownItem
                        key="edit"
                        onPress={() => onEdit(product)}
                        className="text-zinc-700 dark:text-zinc-300"
                      >
                        Edit Product
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onPress={() => onDelete(product.id)}
                      >
                        Delete Product
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple pagination to avoid HeroUI API mismatch */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 disabled:opacity-50"
        >
          Prev
        </button>

        <div className="text-sm text-zinc-700 dark:text-zinc-300">
          Page {currentPage} of {totalPages || 1}
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
          disabled={currentPage >= (totalPages || 1)}
          className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default ProductTable;






