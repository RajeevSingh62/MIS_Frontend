import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UploadState, UploadRecord } from './upload.types';
import { loadUploadHistory, uploadFile } from './upload.thunk';

const initialState: UploadState = {
  history: [],
  lastResult: null,
  uploading: false,
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearLastResult(state) { state.lastResult = null; },
    clearUploadError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    // Load history
    builder
      .addCase(loadUploadHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.lastResult = null;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.lastResult = action.payload as UploadRecord;
        state.history.unshift(action.payload as UploadRecord);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLastResult, clearUploadError } = uploadSlice.actions;
export default uploadSlice.reducer;
