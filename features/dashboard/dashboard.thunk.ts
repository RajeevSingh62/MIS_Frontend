import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLeads } from './dashboard.endpoints';

export const loadLeads = createAsyncThunk(
  'dashboard/loadLeads',
  async (_, { rejectWithValue }) => {
    try { return await fetchLeads(); }
    catch { return rejectWithValue('Failed to load leads'); }
  }
);
