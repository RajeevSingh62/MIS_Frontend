import type { UploadRecord } from '@/data/dummyUploadHistory';
export type { UploadRecord };

export interface UploadResult {
  bankTitle: string;
  filename: string;
  totalRows: number;
  successRows: number;
  exceptionRows: number;
}

export interface UploadState {
  history: UploadRecord[];
  lastResult: UploadResult | null;
  uploading: boolean;
  error: string | null;
}
