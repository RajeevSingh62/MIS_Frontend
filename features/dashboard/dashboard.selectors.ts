import type { RootState } from '@/redux/store';
import type { Lead } from './dashboard.types';

export const selectDashboard = (state: RootState) => state.dashboard;
export const selectAllLeads = (state: RootState) => state.dashboard.leads;
export const selectDashboardFilters = (state: RootState) => state.dashboard.filters;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;

// Derived selector: leads filtered by current filters (client-side)
export const selectFilteredLeads = (state: RootState): Lead[] => {
  const { leads, filters } = state.dashboard;
  return leads.filter((lead) => {
    if (filters.bankId && lead.bankId !== filters.bankId) return false;
    if (filters.productId && lead.productId !== filters.productId) return false;
    if (filters.statusGroup !== 'All' && lead.canonicalGroup !== filters.statusGroup) return false;
    if (filters.dateFrom && lead.lastStatusUpdatedDate < filters.dateFrom) return false;
    if (filters.dateTo && lead.lastStatusUpdatedDate > filters.dateTo) return false;
    return true;
  });
};
