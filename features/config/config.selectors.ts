import type { RootState } from '@/redux/store';

export const selectConfig = (state: RootState) => state.config;
export const selectSelectedBankId = (state: RootState) => state.config.selectedBankId;
export const selectColumnMappings = (state: RootState) => state.config.columnMappings;
export const selectProductMappings = (state: RootState) => state.config.productMappings;
export const selectUnmappedProducts = (state: RootState) => state.config.unmappedProducts;
export const selectStatusMappingRules = (state: RootState) => state.config.statusMappingRules;
export const selectUnmappedStatuses = (state: RootState) => state.config.unmappedStatuses;
export const selectConfigLoading = (state: RootState) => state.config.loading;
export const selectConfigError = (state: RootState) => state.config.error;
