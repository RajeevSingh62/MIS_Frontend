import type { Lead } from '@/data/dummyLeads';
import type { CanonicalGroup } from '@/data/dummyCanonicalStatuses';

export type { Lead };

export interface DashboardFilters {
  bankId: number | null;
  productId: number | null;
  statusGroup: CanonicalGroup | 'All';
  dateFrom: string;
  dateTo: string;
}

export interface DashboardSummary {
  totalLeads: number;
  inProgress: number;
  completed: number;
  rejected: number;
  payoutPending: number; // sum of leadPayout where status = TASK COMPLETE - PAYOUT PENDING
}

export interface DashboardState {
  leads: Lead[];
  filters: DashboardFilters;
  loading: boolean;
  error: string | null;
}
