import type { RootState } from '@/redux/store';

export const selectConfig = (state: RootState) => state.config;
export const selectSelectedBankId = (state: RootState) => state.config.selectedBankId;
export const selectExcelConfigs = (state: RootState) => state.config.excelConfigs;
export const selectStatusMappingRules = (state: RootState) => state.config.statusMappingRules;
export const selectUnmappedStatuses = (state: RootState) => state.config.unmappedStatuses;
export const selectConfigLoading = (state: RootState) => state.config.loading;
export const selectConfigError = (state: RootState) => state.config.error;
