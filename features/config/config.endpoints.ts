import dummyColumnMappings from '@/data/dummyColumnMappings';
import { dummyProductMappings, dummyUnmappedProducts } from '@/data/dummyProductMappings';
import { dummyStatusMappingRules, dummyUnmappedStatuses } from '@/data/dummyStatusMappingRules';
import type { ColumnMapping } from '@/data/dummyColumnMappings';
import type { ProductMapping, UnmappedProduct } from '@/data/dummyProductMappings';
import type { StatusMappingRule, UnmappedStatus } from '@/data/dummyStatusMappingRules';

const delay = (ms = 400) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Column Mappings ────────────────────────────────────────────────────────
export async function fetchColumnMappings(bankId: number): Promise<ColumnMapping[]> {
  await delay();
  // SWAP: return axiosInstance.get(`/api/config/column-mappings?bankId=${bankId}`)
  return dummyColumnMappings[bankId] ?? [];
}

export async function saveColumnMappings(
  bankId: number,
  mappings: ColumnMapping[]
): Promise<void> {
  await delay(600);
  // SWAP: return axiosInstance.put(`/api/config/column-mappings/${bankId}`, { mappings })
  console.log('[mock] saveColumnMappings', { bankId, mappings });
}

// ─── Product Mappings ────────────────────────────────────────────────────────
export async function fetchProductMappings(bankId: number): Promise<{
  mappings: ProductMapping[];
  unmapped: UnmappedProduct[];
}> {
  await delay();
  return {
    mappings: dummyProductMappings[bankId] ?? [],
    unmapped: dummyUnmappedProducts[bankId] ?? [],
  };
}

export async function saveProductMapping(
  _bankId: number,
  _sourceProductName: string,
  _productId: number
): Promise<void> {
  await delay(500);
  // SWAP: return axiosInstance.post('/api/config/product-mappings', { bankId, sourceProductName, productId })
}

export async function deleteProductMapping(_id: number): Promise<void> {
  await delay(400);
  // SWAP: return axiosInstance.delete(`/api/config/product-mappings/${id}`)
}

// ─── Status Mapping Rules ─────────────────────────────────────────────────────
export async function fetchStatusMappings(bankId: number): Promise<{
  rules: StatusMappingRule[];
  unmapped: UnmappedStatus[];
}> {
  await delay();
  return {
    rules: dummyStatusMappingRules[bankId] ?? [],
    unmapped: dummyUnmappedStatuses[bankId] ?? [],
  };
}

export async function saveStatusRule(
  _bankId: number,
  _rule: Omit<StatusMappingRule, 'id'>
): Promise<StatusMappingRule> {
  await delay(500);
  const newRule = { ..._rule, id: Date.now() };
  // SWAP: return axiosInstance.post('/api/config/status-mappings', { bankId, ...rule })
  return newRule;
}

export async function deleteStatusRule(_id: number): Promise<void> {
  await delay(400);
  // SWAP: return axiosInstance.delete(`/api/config/status-mappings/${id}`)
}
