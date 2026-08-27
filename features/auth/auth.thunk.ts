import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest } from './auth.endpoints';
import type { LoginRequest, LoginResponse } from './auth.types';

export const loginUser = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginRequest(payload);
      // Persist to localStorage on success
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        axiosError.response?.data?.message ?? 'Login failed. Please try again.'
      );
    }
  }
);
