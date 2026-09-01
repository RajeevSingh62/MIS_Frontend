import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllUnmappedStatuses } from './exceptions.endpoints';

export const loadAllUnmappedStatuses = createAsyncThunk(
  'exceptions/loadAllUnmappedStatuses',
  async (bankId: number | undefined, { rejectWithValue }) => {
    try {
      return await fetchAllUnmappedStatuses(bankId);
    } catch (e) {
      return rejectWithValue('Failed to load unmapped statuses');
    }
  }
);
