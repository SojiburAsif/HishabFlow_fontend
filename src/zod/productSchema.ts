import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(255, 'Product name must not exceed 255 characters'),
  sku: z.string().trim().max(100, 'SKU must not exceed 100 characters').optional().or(z.literal('')),
  description: z.string().trim().max(2000, 'Description must not exceed 2000 characters').optional().or(z.literal('')),
  stock: z.coerce.number().int('Stock must be an integer').min(0, 'Stock cannot be negative'),
  reorderLevel: z.coerce.number().int('Reorder level must be an integer').min(0, 'Reorder level cannot be negative'),
  purchasePrice: z.string().trim().min(1, 'Purchase price is required'),
  sellingPrice: z.string().trim().min(1, 'Selling price is required'),
  isActive: z.boolean().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
