import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ConfigState, BankExcelConfig } from './config.types';
import {
  loadExcelConfigs,
  addOrUpdateExcelConfig,
  removeExcelConfig,
  loadStatusMappings,
  addOrUpdateStatusRule,
  removeStatusRule,
} from './config.thunk';

const initialState: ConfigState = {
  selectedBankId: null,
  excelConfigs: [],
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
      state.excelConfigs = [];
      state.statusMappingRules = [];
      state.unmappedStatuses = [];
      state.error = null;
    },
    clearConfigError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Excel Configs
    builder
      .addCase(loadExcelConfigs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadExcelConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.excelConfigs = action.payload as BankExcelConfig[];
      })
      .addCase(loadExcelConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Add or Update Excel Config
    builder
      .addCase(addOrUpdateExcelConfig.fulfilled, (state, action) => {
        const index = state.excelConfigs.findIndex(c => c.id === action.payload.id);
        if (index >= 0) {
          state.excelConfigs[index] = action.payload;
        } else {
          state.excelConfigs.push(action.payload);
        }
      });
    // Remove Excel Config
    builder
      .addCase(removeExcelConfig.fulfilled, (state, action) => {
        state.excelConfigs = state.excelConfigs.filter(c => c.id !== action.payload);
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
    // Add or Update Status Rule
    builder
      .addCase(addOrUpdateStatusRule.fulfilled, (state, action) => {
        const index = state.statusMappingRules.findIndex(r => r.id === action.payload.id);
        if (index >= 0) {
          state.statusMappingRules[index] = action.payload;
        } else {
          state.statusMappingRules.push(action.payload);
        }
        
        // Remove from unmapped if it exists there
        state.unmappedStatuses = state.unmappedStatuses.filter(
          (u) =>
            !(u.external_status === action.payload.external_status &&
              u.external_remark === action.payload.external_remark)
        );
      });
    // Remove status rule
    builder
      .addCase(removeStatusRule.fulfilled, (state, action) => {
        const { id, external_status, external_remark } = action.payload;
        const removed = state.statusMappingRules.find((r) => r.id === id);
        if (removed) {
          state.statusMappingRules = state.statusMappingRules.filter((r) => r.id !== id);
          state.unmappedStatuses.unshift({ 
            external_status, 
            external_remark, 
            lead_count: 0, 
            bank_id: state.selectedBankId || 0 
          });
        }
      });
  },
});

export const { setSelectedBank, clearConfigError } = configSlice.actions;
export default configSlice.reducer;
