import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardState, DashboardFilters } from './dashboard.types';
import { loadLeads } from './dashboard.thunk';
import dummyLeads from '@/data/dummyLeads';

const initialState: DashboardState = {
  leads: dummyLeads, // preloaded
  filters: {
    bankId: null,
    productId: null,
    statusGroup: 'All',
    dateFrom: '',
    dateTo: '',
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<DashboardFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      // Reset productId if bank changes
      if ('bankId' in action.payload) {
        state.filters.productId = null;
      }
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLeads.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(loadLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters } = dashboardSlice.actions;
export default dashboardSlice.reducer;
