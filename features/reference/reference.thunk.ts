import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBanks, fetchProducts, fetchLeadStatuses } from './reference.endpoints';
import type { AppDispatch } from '@/redux/store';

export const loadBanks = createAsyncThunk(
  'reference/loadBanks',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBanks();
    } catch {
      return rejectWithValue('Failed to load banks');
    }
  }
);

export const loadProducts = createAsyncThunk(
  'reference/loadProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProducts();
    } catch {
      return rejectWithValue('Failed to load products');
    }
  }
);

export const loadLeadStatuses = createAsyncThunk(
  'reference/loadLeadStatuses',
  async (productId: number | undefined, { rejectWithValue }) => {
    try {
      return await fetchLeadStatuses(productId);
    } catch {
      return rejectWithValue('Failed to load lead statuses');
    }
  }
);

// Bootstrap helper — fires all three fetches in parallel
export function loadAllReference() {
  return (dispatch: AppDispatch) => {
    dispatch(loadBanks());
    dispatch(loadProducts());
    dispatch(loadLeadStatuses(undefined));
  };
}
