import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ConfigState } from './config.types';
import type { ColumnMapping } from '@/data/dummyColumnMappings';
import {
  loadColumnMappings,
  persistColumnMappings,
  loadProductMappings,
  addProductMapping,
  removeProductMapping,
  loadStatusMappings,
  addStatusRule,
  removeStatusRule,
} from './config.thunk';

const initialState: ConfigState = {
  selectedBankId: null,
  columnMappings: [],
  productMappings: [],
  unmappedProducts: [],
  statusMappingRules: [],
  unmappedStatuses: [],
  loading: false,
  error: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setSelectedBank(state, action: PayloadAction<number | null>) {
      state.selectedBankId = action.payload;
      // Clear data when bank changes
      state.columnMappings = [];
      state.productMappings = [];
      state.unmappedProducts = [];
      state.statusMappingRules = [];
      state.unmappedStatuses = [];
      state.error = null;
    },
    updateColumnMapping(
      state,
      action: PayloadAction<{ index: number; sourceColumn: string }>
    ) {
      const { index, sourceColumn } = action.payload;
      if (state.columnMappings[index]) {
        state.columnMappings[index].sourceColumn = sourceColumn;
      }
    },
    clearConfigError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Column mappings
    builder
      .addCase(loadColumnMappings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadColumnMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.columnMappings = action.payload as ColumnMapping[];
      })
      .addCase(loadColumnMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Persist column mappings
    builder
      .addCase(persistColumnMappings.pending, (state) => { state.loading = true; })
      .addCase(persistColumnMappings.fulfilled, (state) => { state.loading = false; })
      .addCase(persistColumnMappings.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      });
    // Product mappings
    builder
      .addCase(loadProductMappings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadProductMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.productMappings = action.payload.mappings;
        state.unmappedProducts = action.payload.unmapped;
      })
      .addCase(loadProductMappings.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      });
    // Add product mapping
    builder
      .addCase(addProductMapping.fulfilled, (state, action) => {
        const { sourceProductName, productId, productTitle } = action.payload;
        // Move from unmapped to mapped
        state.unmappedProducts = state.unmappedProducts.filter(
          (u) => u.sourceProductName !== sourceProductName
        );
        state.productMappings.push({
          id: Date.now(),
          sourceProductName,
          productId,
          productTitle,
        });
      });
    // Remove product mapping
    builder
      .addCase(removeProductMapping.fulfilled, (state, action) => {
        const { id, sourceProductName } = action.payload;
        const removed = state.productMappings.find((m) => m.id === id);
        if (removed) {
          state.productMappings = state.productMappings.filter((m) => m.id !== id);
          state.unmappedProducts.unshift({
            sourceProductName,
            leadCount: 0,
          });
        }
      });
    // Status mappings
    builder
      .addCase(loadStatusMappings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadStatusMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.statusMappingRules = action.payload.rules;
        state.unmappedStatuses = action.payload.unmapped;
      })
      .addCase(loadStatusMappings.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      });
    // Add status rule
    builder
      .addCase(addStatusRule.fulfilled, (state, action) => {
        state.statusMappingRules.push(action.payload);
        state.unmappedStatuses = state.unmappedStatuses.filter(
          (u) =>
            !(u.sourceStatus === action.payload.sourceStatus &&
              u.sourceSubStatus === action.payload.sourceSubStatus)
        );
      });
    // Remove status rule
    builder
      .addCase(removeStatusRule.fulfilled, (state, action) => {
        const { id, sourceStatus, sourceSubStatus } = action.payload;
        const removed = state.statusMappingRules.find((r) => r.id === id);
        if (removed) {
          state.statusMappingRules = state.statusMappingRules.filter((r) => r.id !== id);
          state.unmappedStatuses.unshift({ sourceStatus, sourceSubStatus, remarkPattern: '', leadCount: 0 });
        }
      });
  },
});

export const { setSelectedBank, updateColumnMapping, clearConfigError } = configSlice.actions;
export default configSlice.reducer;
