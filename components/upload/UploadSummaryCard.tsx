'use client';

import Link from 'next/link';
import type { UploadRecord } from '@/features/upload/upload.types';

interface UploadSummaryCardProps {
  result: UploadRecord;
}

export default function UploadSummaryCard({ result }: UploadSummaryCardProps) {
  const isProcessing = result.status === 'PROCESSING' || result.status === 'UPLOADED';
  const successRows = result.updated_records + result.unchanged_records;
  const exceptionRows = result.unmapped_records + result.failed_records;
  
  const successPct = result.total_records ? ((successRows / result.total_records) * 100).toFixed(1) : '0.0';
  const exceptionPct = result.total_records ? ((exceptionRows / result.total_records) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        {isProcessing ? (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
            <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900">{isProcessing ? 'Processing Upload...' : 'Upload Complete'}</p>
          <p className="text-xs text-gray-500">{result.bank?.bank_title || 'Bank'} · {result.file_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col gap-0.5 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Total Rows</p>
          <p className="text-xl font-bold text-gray-900">{result.total_records?.toLocaleString() || 0}</p>
        </div>
        <div className="flex flex-col gap-0.5 bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600">✅ Success</p>
          <p className="text-xl font-bold text-green-700">{successRows.toLocaleString()}</p>
          <p className="text-xs text-green-500">{successPct}%</p>
        </div>
        <div className="flex flex-col gap-0.5 bg-amber-50 rounded-lg p-3">
          <p className="text-xs text-amber-600">⚠️ Unmapped</p>
          <p className="text-xl font-bold text-amber-700">{result.unmapped_records?.toLocaleString() || 0}</p>
          <p className="text-xs text-amber-500">Needs mapping</p>
        </div>
        <div className="flex flex-col gap-0.5 bg-red-50 rounded-lg p-3">
          <p className="text-xs text-red-600">❌ Failed</p>
          <p className="text-xl font-bold text-red-700">{result.failed_records?.toLocaleString() || 0}</p>
          <p className="text-xs text-red-500">Errors/Not found</p>
        </div>
      </div>

      {!isProcessing && result.unmapped_records > 0 && (
        <Link
          href="/exceptions"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2"
        >
          Map {result.unmapped_records} exceptions in the Exception Queue →
        </Link>
      )}
    </div>
  );
}
