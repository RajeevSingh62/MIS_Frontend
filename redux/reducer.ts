import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/auth.slice';
import configReducer from '@/features/config/config.slice';
import uploadReducer from '@/features/upload/upload.slice';
import dashboardReducer from '@/features/dashboard/dashboard.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  config: configReducer,
  upload: uploadReducer,
  dashboard: dashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
