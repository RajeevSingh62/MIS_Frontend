import axiosInstance from '@/lib/axiosInstance';
import type { UnmappedStatus } from '@/features/config/config.types';

export async function fetchAllUnmappedStatuses(bankId?: number): Promise<UnmappedStatus[]> {
  const query = bankId ? `?bank_id=${bankId}` : '';
  const { data } = await axiosInstance.get(`/api/v1/status-mappings/unmapped${query}`);
  return data;
}
