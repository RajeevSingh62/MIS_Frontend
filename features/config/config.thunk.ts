import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchColumnMappings,
  saveColumnMappings,
  fetchProductMappings,
  saveProductMapping,
  deleteProductMapping,
  fetchStatusMappings,
  saveStatusRule,
  deleteStatusRule,
} from './config.endpoints';
import type { ColumnMapping } from '@/data/dummyColumnMappings';
import type { StatusMappingRule } from '@/data/dummyStatusMappingRules';

export const loadColumnMappings = createAsyncThunk(
  'config/loadColumnMappings',
  async (bankId: number, { rejectWithValue }) => {
    try { return await fetchColumnMappings(bankId); }
    catch (e) { return rejectWithValue('Failed to load column mappings'); }
  }
);

export const persistColumnMappings = createAsyncThunk(
  'config/persistColumnMappings',
  async ({ bankId, mappings }: { bankId: number; mappings: ColumnMapping[] }, { rejectWithValue }) => {
    try { await saveColumnMappings(bankId, mappings); return mappings; }
    catch (e) { return rejectWithValue('Failed to save column mappings'); }
  }
);

export const loadProductMappings = createAsyncThunk(
  'config/loadProductMappings',
  async (bankId: number, { rejectWithValue }) => {
    try { return await fetchProductMappings(bankId); }
    catch (e) { return rejectWithValue('Failed to load product mappings'); }
  }
);

export const addProductMapping = createAsyncThunk(
  'config/addProductMapping',
  async (
    { bankId, sourceProductName, productId, productTitle }: {
      bankId: number; sourceProductName: string; productId: number; productTitle: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await saveProductMapping(bankId, sourceProductName, productId);
      return { sourceProductName, productId, productTitle };
    } catch (e) { return rejectWithValue('Failed to save product mapping'); }
  }
);

export const removeProductMapping = createAsyncThunk(
  'config/removeProductMapping',
  async ({ id, sourceProductName }: { id: number; sourceProductName: string }, { rejectWithValue }) => {
    try { await deleteProductMapping(id); return { id, sourceProductName }; }
    catch (e) { return rejectWithValue('Failed to remove product mapping'); }
  }
);

export const loadStatusMappings = createAsyncThunk(
  'config/loadStatusMappings',
  async (bankId: number, { rejectWithValue }) => {
    try { return await fetchStatusMappings(bankId); }
    catch (e) { return rejectWithValue('Failed to load status mappings'); }
  }
);

export const addStatusRule = createAsyncThunk(
  'config/addStatusRule',
  async (
    { bankId, rule }: { bankId: number; rule: Omit<StatusMappingRule, 'id'> },
    { rejectWithValue }
  ) => {
    try { return await saveStatusRule(bankId, rule); }
    catch (e) { return rejectWithValue('Failed to save status rule'); }
  }
);

export const removeStatusRule = createAsyncThunk(
  'config/removeStatusRule',
  async ({ id, sourceStatus, sourceSubStatus }: { id: number; sourceStatus: string; sourceSubStatus: string }, { rejectWithValue }) => {
    try { await deleteStatusRule(id); return { id, sourceStatus, sourceSubStatus }; }
    catch (e) { return rejectWithValue('Failed to remove status rule'); }
  }
);
