import dummyLeads from '@/data/dummyLeads';
import type { Lead } from '@/data/dummyLeads';

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

export async function fetchLeads(): Promise<Lead[]> {
  await delay();
  // SWAP: return axiosInstance.get('/api/dashboard/leads').then(r => r.data.data)
  return dummyLeads;
}
