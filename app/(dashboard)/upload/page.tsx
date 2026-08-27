'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectLastUploadResult, selectUploading } from '@/features/upload/upload.selectors';
import UploadForm from '@/components/upload/UploadForm';
import UploadSummaryCard from '@/components/upload/UploadSummaryCard';
import RecentUploadsTable from '@/components/upload/RecentUploadsTable';

export default function UploadPage() {
  const lastResult = useAppSelector(selectLastUploadResult);
  const uploading = useAppSelector(selectUploading);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload bank lead files for processing. Rows that can't be mapped will go to the Exception Queue.
        </p>
      </div>

      {/* Processing banner */}
      {uploading && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm text-indigo-700">
          <svg className="animate-spin h-4 w-4 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing your file… This usually takes a few seconds.
        </div>
      )}

      {/* Upload form */}
      <UploadForm />

      {/* Last result summary */}
      {lastResult && !uploading && (
        <UploadSummaryCard result={lastResult} />
      )}

      {/* Recent uploads table */}
      <RecentUploadsTable />
    </div>
  );
}
