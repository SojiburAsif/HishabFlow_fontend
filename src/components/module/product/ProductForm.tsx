'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  TextArea,
  Spinner,
} from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateProductSchema, CreateProductInput } from '@/zod/productSchema';

type ProductFormValues = z.input<typeof CreateProductSchema>;
type ProductFormOutput = z.output<typeof CreateProductSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  initialData?: Partial<ProductFormValues> & { id?: string };
  isLoading?: boolean;
}

const defaultValues: ProductFormValues = {
  name: '',
  sku: '',
  description: '',
  stock: 0,
  reorderLevel: 0,
  purchasePrice: '',
  sellingPrice: '',
  isActive: true,
};

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues, undefined, ProductFormOutput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
      return;
    }

    reset({
      ...defaultValues,
      ...initialData,
      sku: initialData?.sku ?? '',
      description: initialData?.description ?? '',
      isActive: initialData?.isActive ?? true,
    });
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = async (data: ProductFormOutput) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
        }
      }}
    >
      <ModalHeader className="flex flex-col gap-1 text-zinc-900 dark:text-zinc-50">
        {initialData?.id ? 'Edit Product' : 'Add New Product'}
      </ModalHeader>

      <ModalBody className="space-y-6 max-h-[70vh] overflow-y-auto">
        <form id="product-form" className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Product Name</label>
            <Input placeholder="Enter product name" {...register('name')} />
            {errors.name ? <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">SKU</label>
            <Input placeholder="e.g., PROD-001" {...register('sku')} />
            {errors.sku ? <span className="mt-1 block text-xs text-red-500">{errors.sku.message}</span> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Stock</label>
              <Input type="number" min="0" placeholder="0" {...register('stock', { valueAsNumber: true })} />
              {errors.stock ? <span className="mt-1 block text-xs text-red-500">{errors.stock.message}</span> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Reorder Level</label>
              <Input type="number" min="0" placeholder="0" {...register('reorderLevel', { valueAsNumber: true })} />
              {errors.reorderLevel ? (
                <span className="mt-1 block text-xs text-red-500">{errors.reorderLevel.message}</span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Purchase Price</label>
              <Input type="number" step="0.01" min="0" placeholder="0.00" {...register('purchasePrice')} />
              {errors.purchasePrice ? (
                <span className="mt-1 block text-xs text-red-500">{errors.purchasePrice.message}</span>
              ) : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Selling Price</label>
              <Input type="number" step="0.01" min="0" placeholder="0.00" {...register('sellingPrice')} />
              {errors.sellingPrice ? (
                <span className="mt-1 block text-xs text-red-500">{errors.sellingPrice.message}</span>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-900 dark:text-zinc-50">Description</label>
            <TextArea placeholder="Enter product description" {...register('description')} />
            {errors.description ? (
              <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>
            ) : null}
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
              {...register('isActive')}
            />
            Active product
          </label>
        </form>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={handleModalClose}
          className="rounded-lg bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting || isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {isSubmitting || isLoading ? (
            <>
              <Spinner size="sm" />
              Saving...
            </>
          ) : initialData?.id ? (
            'Update Product'
          ) : (
            'Add Product'
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductForm;




