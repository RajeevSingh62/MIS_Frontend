'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '@/features/auth/auth.selectors';
import { loginUser } from '@/features/auth/auth.thunk';
import { logout } from '@/features/auth/auth.slice';
import type { LoginRequest } from '@/features/auth/auth.types';

export function useAuth() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = (payload: LoginRequest) => dispatch(loginUser(payload));
  const logoutUser = () => dispatch(logout());

  return { user, isAuthenticated, loading, error, login, logout: logoutUser };
}
