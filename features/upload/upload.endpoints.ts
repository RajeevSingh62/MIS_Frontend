import axiosInstance from '@/lib/axiosInstance';
import type { UploadRecord } from './upload.types';

export async function fetchUploadHistory(): Promise<UploadRecord[]> {
  const { data } = await axiosInstance.get('/api/v1/status-uploads');
  return data.data || [];
}

export async function uploadFile(
  formData: FormData
): Promise<UploadRecord> {
  const { data } = await axiosInstance.post('/api/v1/status-uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.upload;
}
