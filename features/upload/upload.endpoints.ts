import dummyUploadHistory from '@/data/dummyUploadHistory';
import type { UploadRecord } from '@/data/dummyUploadHistory';
import type { UploadResult } from './upload.types';

const delay = (ms = 1500) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchUploadHistory(): Promise<UploadRecord[]> {
  await delay(400);
  // SWAP: return axiosInstance.get('/api/uploads/history').then(r => r.data.data)
  return [...dummyUploadHistory];
}

export async function simulateUpload(
  bankTitle: string,
  filename: string
): Promise<UploadResult> {
  await delay(1500); // simulate processing time
  // SWAP: return axiosInstance.post('/api/uploads', formData).then(r => r.data.data)
  const totalRows = Math.floor(Math.random() * 2500) + 500;
  const successRate = 0.90 + Math.random() * 0.07; // 90–97%
  const successRows = Math.floor(totalRows * successRate);
  const exceptionRows = totalRows - successRows;
  return { bankTitle, filename, totalRows, successRows, exceptionRows };
}
