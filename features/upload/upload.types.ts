export interface UploadRecord {
  id: number;
  bank_id: number;
  product_id: number | null;
  file_name: string;
  file_path: string;
  total_records: number;
  processed_records: number;
  updated_records: number;
  unchanged_records: number;
  unmapped_records: number;
  failed_records: number;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
  uploaded_by: number | null;
  uploaded_at: string;
  completed_at: string | null;
  bank?: { id: number; bank_title: string };
  product?: { id: number; title: string };
  uploader?: { id: number; first_name: string; last_name: string };
}

export interface UploadRowRecord {
  id: number;
  upload_id: number;
  row_number: number | null;
  lead_identifier: string;
  external_status: string;
  external_remark: string | null;
  old_status_id: number | null;
  new_status_id: number | null;
  processing_status: 'UPDATED' | 'UNCHANGED' | 'UNMAPPED' | 'FAILED' | 'LEAD_NOT_FOUND';
  error_message: string | null;
  processed_at: string;
}

export interface UploadState {
  history: UploadRecord[];
  lastResult: UploadRecord | null;
  uploading: boolean;
  error: string | null;
}
