'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import type { UploadRecord, UploadRowRecord } from '@/features/upload/upload.types';
import { cn } from '@/utils/cn';
import UploadSummaryCard from '@/components/upload/UploadSummaryCard';

export default function UploadDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [upload, setUpload] = useState<UploadRecord | null>(null);
  const [records, setRecords] = useState<UploadRowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUploadDetails();
  }, [id]);

  useEffect(() => {
    if (upload) {
      fetchRecords();
    }
  }, [upload, page, filter]);

  const fetchUploadDetails = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/v1/status-uploads/${id}`);
      setUpload(data);
    } catch (err) {
      console.error('Failed to load upload details', err);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });
      if (filter) query.append('processing_status', filter);

      const { data } = await axiosInstance.get(`/api/v1/status-uploads/${id}/records?${query}`);
      setRecords(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load records', err);
    } finally {
      setLoading(false);
    }
  };

  if (!upload && loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!upload) {
    return <div className="text-center py-20 text-gray-500">Upload not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/upload')}
          className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-lg border border-gray-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            {upload.file_name} • Uploaded {new Date(upload.uploaded_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        </div>
      </div>

      <UploadSummaryCard result={upload} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Row Level Details</h2>
          
          <div className="flex items-center gap-4">
            {upload.file_path && upload.status !== 'PROCESSING' && (
              <a 
                href={`/api/v1/status-uploads/${upload.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Processed File
              </a>
            )}

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="text-sm rounded-lg border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="UPDATED">Updated</option>
              <option value="UNCHANGED">Unchanged</option>
              <option value="UNMAPPED">Unmapped</option>
              <option value="FAILED">Failed</option>
              <option value="LEAD_NOT_FOUND">Lead Not Found</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-500 w-16">Row</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Lead ID</th>
                <th className="px-4 py-3 font-semibold text-gray-500">External Status</th>
                <th className="px-4 py-3 font-semibold text-gray-500">External Remark</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Result</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Error / Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    {loading ? 'Loading...' : 'No records found.'}
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500 text-xs">{rec.row_number}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{rec.lead_identifier}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{rec.external_status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]" title={rec.external_remark || ''}>
                      {rec.external_remark || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide",
                        rec.processing_status === 'UPDATED' && "bg-green-100 text-green-700",
                        rec.processing_status === 'UNCHANGED' && "bg-gray-100 text-gray-600",
                        rec.processing_status === 'UNMAPPED' && "bg-amber-100 text-amber-700",
                        rec.processing_status === 'FAILED' && "bg-red-100 text-red-700",
                        rec.processing_status === 'LEAD_NOT_FOUND' && "bg-orange-100 text-orange-700"
                      )}>
                        {rec.processing_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[300px] truncate" title={rec.error_message || ''}>
                      {rec.error_message || (rec.new_status_id ? `Mapped to ID: ${rec.new_status_id}` : '-')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
