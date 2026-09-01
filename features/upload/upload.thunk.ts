import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUploadHistory, uploadFile as uploadFileApi } from './upload.endpoints';
import type { UploadRecord } from './upload.types';

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
    formData: FormData,
    { rejectWithValue }
  ) => {
    try { return await uploadFileApi(formData); }
    catch (error: any) { 
      return rejectWithValue(error.response?.data?.message || 'Upload failed. Please try again.'); 
    }
  }
);
