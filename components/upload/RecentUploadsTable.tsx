'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectUploadHistory } from '@/features/upload/upload.selectors';
import type { UploadRecord } from '@/features/upload/upload.types';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';

const statusConfig: Record<UploadRecord['status'], { bg: string; text: string }> = {
  COMPLETED:  { bg: 'bg-green-100', text: 'text-green-700' },
  COMPLETED_WITH_ERRORS: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PROCESSING: { bg: 'bg-blue-100',  text: 'text-blue-700'  },
  UPLOADED:   { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  FAILED:     { bg: 'bg-red-100',   text: 'text-red-700'   },
};

export default function RecentUploadsTable() {
  const history = useAppSelector(selectUploadHistory);
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Recent Uploads</h2>
        <span className="text-xs text-gray-400">{history.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Bank', 'Filename', 'Uploaded By', 'Uploaded At', 'Total', 'Success', 'Unmapped', 'Failed', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wide text-gray-500 text-xs whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                  No uploads yet.
                </td>
              </tr>
            ) : (
              history.map((rec, i) => {
                const sc = statusConfig[rec.status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                const successRows = rec.updated_records + rec.unchanged_records;
                return (
                  <tr 
                    key={rec.id} 
                    onClick={() => router.push(`/upload/${rec.id}`)}
                    className={cn(
                      "border-b border-gray-100 cursor-pointer hover:bg-indigo-50 transition-colors",
                      i % 2 ? 'bg-gray-50/30' : ''
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{rec.bank?.bank_title || 'Bank'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-[200px] truncate" title={rec.file_name}>{rec.file_name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                      {rec.uploader ? `${rec.uploader.first_name} ${rec.uploader.last_name}` : 'System'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {rec.uploaded_at ? new Date(rec.uploaded_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{rec.total_records?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3 text-green-700 font-medium">{successRows.toLocaleString()}</td>
                    <td className="px-4 py-3 text-amber-600 font-medium">{rec.unmapped_records?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">{rec.failed_records?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap', sc.bg, sc.text)}>
                        {rec.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
