import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchExcelConfigs,
  saveExcelConfig,
  deleteExcelConfig,
  fetchStatusMappings,
  saveStatusRule,
  deleteStatusRule,
} from './config.endpoints';
import type { BankExcelConfig, StatusMappingRule } from './config.types';

export const loadExcelConfigs = createAsyncThunk(
  'config/loadExcelConfigs',
  async (bankId: number, { rejectWithValue }) => {
    try { return await fetchExcelConfigs(bankId); }
    catch (e) { return rejectWithValue('Failed to load excel configs'); }
  }
);

export const addOrUpdateExcelConfig = createAsyncThunk(
  'config/addOrUpdateExcelConfig',
  async (config: Partial<BankExcelConfig>, { rejectWithValue }) => {
    try { return await saveExcelConfig(config); }
    catch (e) { return rejectWithValue('Failed to save excel config'); }
  }
);

export const removeExcelConfig = createAsyncThunk(
  'config/removeExcelConfig',
  async (id: number, { rejectWithValue }) => {
    try { await deleteExcelConfig(id); return id; }
    catch (e) { return rejectWithValue('Failed to remove excel config'); }
  }
);

export const loadStatusMappings = createAsyncThunk(
  'config/loadStatusMappings',
  async (bankId: number, { rejectWithValue }) => {
    try { return await fetchStatusMappings(bankId); }
    catch (e) { return rejectWithValue('Failed to load status mappings'); }
  }
);

export const addOrUpdateStatusRule = createAsyncThunk(
  'config/addOrUpdateStatusRule',
  async (rule: Partial<StatusMappingRule>, { rejectWithValue }) => {
    try { return await saveStatusRule(rule); }
    catch (e) { return rejectWithValue('Failed to save status rule'); }
  }
);

export const removeStatusRule = createAsyncThunk(
  'config/removeStatusRule',
  async ({ id, external_status, external_remark }: { id: number; external_status: string; external_remark: string | null }, { rejectWithValue }) => {
    try { await deleteStatusRule(id); return { id, external_status, external_remark }; }
    catch (e) { return rejectWithValue('Failed to remove status rule'); }
  }
);
