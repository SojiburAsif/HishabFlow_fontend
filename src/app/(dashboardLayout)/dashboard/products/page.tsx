'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductTable, { ProductTableRow } from '@/components/module/product/ProductTable';
import ProductForm from '@/components/module/product/ProductForm';
import { CreateProductInput } from '@/zod/productSchema';
import { productService, type ProductRecord } from '@/services/product.service';

interface Product extends ProductRecord {
  id: string;
}

const statusFromStock = (stock: number): ProductTableRow['status'] => {
  if (stock <= 0) {
    return 'out-of-stock';
  }
  if (stock < 10) {
    return 'low-stock';
  }
  return 'in-stock';
};

const toTableRow = (product: Product): ProductTableRow => {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku ?? '—',
    category: product.categoryId ?? 'Uncategorized',
    price: Number(product.sellingPrice ?? 0),
    quantity: product.stock,
    status: statusFromStock(product.stock),
  };
};

const toFormValues = (product: Product): Product & CreateProductInput => ({
  ...product,
  sku: product.sku ?? '',
  description: product.description ?? '',
  stock: product.stock,
  reorderLevel: product.reorderLevel,
  purchasePrice: String(product.purchasePrice ?? ''),
  sellingPrice: String(product.sellingPrice ?? ''),
  isActive: product.isActive,
});

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getProducts();

      if (!response.success) {
        throw new Error(response.error || 'Failed to load products');
      }

      const list = (response.data ?? []) as Product[];
      setProducts(list);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products. Please try again later.');
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = useCallback(() => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  }, []);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await productService.deactivateProduct(productId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to deactivate product');
      }

      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to deactivate product');
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts]);

  const handleFormSubmit = async (data: CreateProductInput) => {
    try {
      setIsLoading(true);

      const response = selectedProduct?.id
        ? await productService.updateProduct(selectedProduct.id, data)
        : await productService.createProduct(data);

      if (!response.success) {
        throw new Error(response.error || 'Failed to save product');
      }

      await fetchProducts();
      setIsFormOpen(false);
      setSelectedProduct(undefined);
    } catch (error) {
      console.error('Error submitting product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const tableRows = useMemo(
    () => products.filter((product) => product.isActive !== false).map(toTableRow),
    [products]
  );

  const formInitialData = selectedProduct ? toFormValues(selectedProduct) : undefined;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Products</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage your product inventory and pricing
          </p>
        </div>

        <Button
          onPress={handleAddProduct}
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Product
        </Button>
      </motion.div>

      {isInitialLoading && (
        <div className="rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 p-8 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <Spinner color="accent" />
            <span>Loading products...</span>
          </div>
        </div>
      )}

      {!isInitialLoading && error && (
        <div className="rounded-lg border border-red-300/60 dark:border-red-700/60 p-4 bg-red-50/70 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {!isInitialLoading && !error && (
        <ProductTable
          products={tableRows}
          onEdit={(row) => {
            const selected = products.find((p) => p.id === row.id);
            if (selected) {
              handleEditProduct(selected);
            }
          }}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(undefined);
        }}
        onSubmit={handleFormSubmit}
        initialData={formInitialData}
        isLoading={isLoading}
      />

      {/* Empty State */}
      {!isInitialLoading && !error && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">No products yet</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">Get started by adding your first product</p>
          <Button
            onPress={handleAddProduct}
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Product
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductsPage;


