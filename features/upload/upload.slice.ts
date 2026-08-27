import { createSlice } from '@reduxjs/toolkit';
import type { UploadState } from './upload.types';
import { loadUploadHistory, uploadFile } from './upload.thunk';
import dummyUploadHistory from '@/data/dummyUploadHistory';

const initialState: UploadState = {
  history: dummyUploadHistory, // preloaded so table shows immediately
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
        state.lastResult = action.payload;
        // Prepend to history
        state.history.unshift({
          id: Date.now(),
          bankTitle: action.payload.bankTitle,
          filename: action.payload.filename,
          uploadedBy: 'Current User',
          uploadedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          totalRows: action.payload.totalRows,
          successRows: action.payload.successRows,
          exceptionRows: action.payload.exceptionRows,
          status: 'Completed',
        });
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLastResult, clearUploadError } = uploadSlice.actions;
export default uploadSlice.reducer;
