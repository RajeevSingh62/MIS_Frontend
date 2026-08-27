import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './auth.thunk';
import { logoutRequest } from './auth.endpoints';
import type { AuthState, User } from './auth.types';

// Rehydrate from localStorage on initial load (SSR-safe)
function getInitialState(): AuthState {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (token && userRaw) {
      try {
        const user: User = JSON.parse(userRaw);
        return {
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      } catch {
        // corrupted storage — fall through to defaults
      }
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      logoutRequest(); // clear localStorage
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed.';
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
