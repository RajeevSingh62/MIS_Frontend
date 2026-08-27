import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUploadHistory, simulateUpload } from './upload.endpoints';

export const loadUploadHistory = createAsyncThunk(
  'upload/loadHistory',
  async (_, { rejectWithValue }) => {
    try { return await fetchUploadHistory(); }
    catch { return rejectWithValue('Failed to load upload history'); }
  }
);

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (
    { bankTitle, filename }: { bankTitle: string; filename: string },
    { rejectWithValue }
  ) => {
    try { return await simulateUpload(bankTitle, filename); }
    catch { return rejectWithValue('Upload failed. Please try again.'); }
  }
);
