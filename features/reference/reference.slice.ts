import { createSlice } from '@reduxjs/toolkit';
import type { ReferenceState } from './reference.types';
import { loadBanks, loadProducts, loadLeadStatuses } from './reference.thunk';

const initialState: ReferenceState = {
  banks: [],
  products: [],
  leadStatuses: [],
  loading: false,
  error: null,
};

const referenceSlice = createSlice({
  name: 'reference',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Banks
    builder
      .addCase(loadBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload;
      })
      .addCase(loadBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Products
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Lead statuses
    builder
      .addCase(loadLeadStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLeadStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.leadStatuses = action.payload;
      })
      .addCase(loadLeadStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default referenceSlice.reducer;
