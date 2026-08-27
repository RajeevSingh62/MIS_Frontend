'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectUploadHistory } from '@/features/upload/upload.selectors';
import type { UploadRecord } from '@/data/dummyUploadHistory';
import { cn } from '@/utils/cn';

const statusConfig: Record<UploadRecord['status'], { bg: string; text: string }> = {
  Completed:  { bg: 'bg-green-100', text: 'text-green-700' },
  Processing: { bg: 'bg-blue-100',  text: 'text-blue-700'  },
  Failed:     { bg: 'bg-red-100',   text: 'text-red-700'   },
};

export default function RecentUploadsTable() {
  const history = useAppSelector(selectUploadHistory);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Recent Uploads</h2>
        <span className="text-xs text-gray-400">{history.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Bank', 'Filename', 'Uploaded By', 'Uploaded At', 'Total', 'Success', 'Exceptions', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                  No uploads yet.
                </td>
              </tr>
            ) : (
              history.map((rec, i) => {
                const sc = statusConfig[rec.status];
                return (
                  <tr key={rec.id} className={`border-b border-gray-100 ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{rec.bankTitle}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-[200px] truncate">{rec.filename}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{rec.uploadedBy}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{rec.uploadedAt}</td>
                    <td className="px-4 py-3 text-gray-700">{rec.totalRows.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-700 font-medium">{rec.successRows.toLocaleString()}</td>
                    <td className="px-4 py-3 text-amber-600 font-medium">{rec.exceptionRows.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', sc.bg, sc.text)}>
                        {rec.status}
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
