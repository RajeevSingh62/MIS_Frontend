import type { RootState } from '@/redux/store';

export const selectUpload = (state: RootState) => state.upload;
export const selectUploadHistory = (state: RootState) => state.upload.history;
export const selectLastUploadResult = (state: RootState) => state.upload.lastResult;
export const selectUploading = (state: RootState) => state.upload.uploading;
export const selectUploadError = (state: RootState) => state.upload.error;
