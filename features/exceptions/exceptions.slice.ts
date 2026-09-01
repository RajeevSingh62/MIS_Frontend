import { createSlice } from '@reduxjs/toolkit';
import type { ExceptionsState } from './exceptions.types';
import { loadAllUnmappedStatuses } from './exceptions.thunk';
import type { UnmappedStatus } from '@/features/config/config.types';
import type { RootState } from '@/redux/store';

const initialState: ExceptionsState = {
  unmappedStatuses: [],
  loading: false,
  error: null,
};

const exceptionsSlice = createSlice({
  name: 'exceptions',
  initialState,
  reducers: {
    removeUnmappedStatus(state, action: { payload: { external_status: string, external_remark: string | null } }) {
      state.unmappedStatuses = state.unmappedStatuses.filter(
        (u) => !(u.external_status === action.payload.external_status && u.external_remark === action.payload.external_remark)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllUnmappedStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAllUnmappedStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.unmappedStatuses = action.payload;
      })
      .addCase(loadAllUnmappedStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { removeUnmappedStatus } = exceptionsSlice.actions;

export const selectExceptions = (state: RootState) => state.exceptions;
export const selectAllUnmappedStatuses = (state: RootState) => state.exceptions.unmappedStatuses;
export const selectExceptionsLoading = (state: RootState) => state.exceptions.loading;
export const selectExceptionsError = (state: RootState) => state.exceptions.error;

export default exceptionsSlice.reducer;
