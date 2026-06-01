import { publicEnv } from '@/lib/env';
import type { CreateProductInput, UpdateProductInput } from '@/zod/productSchema';

const API_BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

const readAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('accessToken');
};

export interface ProductRecord {
  id: string;
  shopId?: string;
  categoryId?: string | null;
  name: string;
  sku?: string | null;
  description?: string | null;
  stock: number;
  reorderLevel: number;
  purchasePrice: string | number;
  sellingPrice: string | number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const requestJson = async <T>(path: string, init?: RequestInit): Promise<ServiceResponse<T>> => {
  try {
    const accessToken = readAccessToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(init?.headers ?? {}),
      },
      ...init,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Request failed',
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data ?? data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

const normalizeProductPayload = (payload: Partial<CreateProductInput | UpdateProductInput>) => ({
  ...payload,
  sku: payload.sku?.trim() ? payload.sku.trim() : undefined,
  description: payload.description?.trim() ? payload.description.trim() : undefined,
});

class ProductService {
  async getProducts(): Promise<ServiceResponse<ProductRecord[]>> {
    return requestJson<ProductRecord[]>('/product', { method: 'GET' });
  }

  async createProduct(payload: CreateProductInput): Promise<ServiceResponse<ProductRecord>> {
    return requestJson<ProductRecord>('/product', {
      method: 'POST',
      body: JSON.stringify(normalizeProductPayload(payload)),
    });
  }

  async updateProduct(
    productId: string,
    payload: UpdateProductInput
  ): Promise<ServiceResponse<ProductRecord>> {
    return requestJson<ProductRecord>(`/product/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(normalizeProductPayload(payload)),
    });
  }

  async deactivateProduct(productId: string): Promise<ServiceResponse<ProductRecord>> {
    return this.updateProduct(productId, { isActive: false });
  }
}

export const productService = new ProductService();