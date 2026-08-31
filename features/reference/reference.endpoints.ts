import axiosInstance from '@/lib/axiosInstance';
import type { Bank, Product, LeadStatus } from './reference.types';

// GET /api/v1/getBanks → [{ id, bank_title }]
export async function fetchBanks(): Promise<Bank[]> {
  const response = await axiosInstance.get<Bank[]>('/api/v1/getBanks');
  return response.data;
}

// GET /api/v1/getProducts → [{ id, title, bank_id }]
export async function fetchProducts(): Promise<Product[]> {
  const response = await axiosInstance.get<Product[]>('/api/v1/getProducts');
  return response.data;
}

// GET /api/v1/getLeadStatuses?productId=<n> → [{ id, title, parent_id, product_id }]
export async function fetchLeadStatuses(productId?: number): Promise<LeadStatus[]> {
  const params = productId ? { productId } : {};
  const response = await axiosInstance.get<LeadStatus[]>('/api/v1/getLeadStatuses', { params });
  return response.data;
}
