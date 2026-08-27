'use client';

import Link from 'next/link';
import type { UploadResult } from '@/features/upload/upload.types';

interface UploadSummaryCardProps {
  result: UploadResult;
}

export default function UploadSummaryCard({ result }: UploadSummaryCardProps) {
  const successPct = ((result.successRows / result.totalRows) * 100).toFixed(1);
  const exceptionPct = ((result.exceptionRows / result.totalRows) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Upload Complete</p>
          <p className="text-xs text-gray-500">{result.bankTitle} · {result.filename}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col gap-0.5 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Total Rows</p>
          <p className="text-xl font-bold text-gray-900">{result.totalRows.toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-0.5 bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600">✅ Success</p>
          <p className="text-xl font-bold text-green-700">{result.successRows.toLocaleString()}</p>
          <p className="text-xs text-green-500">{successPct}%</p>
        </div>
        <div className="flex flex-col gap-0.5 bg-amber-50 rounded-lg p-3">
          <p className="text-xs text-amber-600">⚠️ Exceptions</p>
          <p className="text-xl font-bold text-amber-700">{result.exceptionRows.toLocaleString()}</p>
          <p className="text-xs text-amber-500">{exceptionPct}%</p>
        </div>
      </div>

      {result.exceptionRows > 0 && (
        <Link
          href="/exceptions"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View {result.exceptionRows} exceptions in the Exception Queue →
        </Link>
      )}
    </div>
  );
}
