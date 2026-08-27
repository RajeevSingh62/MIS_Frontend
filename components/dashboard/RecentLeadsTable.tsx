'use client';

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectFilteredLeads } from '@/features/dashboard/dashboard.selectors';
import StatusBadge from '@/components/ui/StatusBadge';

const PAGE_SIZE = 10;

export default function RecentLeadsTable() {
  const leads = useAppSelector(selectFilteredLeads);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
  const paginated = leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Leads
          <span className="ml-2 text-xs font-normal text-gray-400">({leads.length} matched)</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Bank', 'Product', 'Customer', 'Mobile', 'Lead ID', 'Status', 'Last Updated'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  No leads match the current filters.
                </td>
              </tr>
            ) : (
              paginated.map((lead, i) => (
                <tr key={lead.id} className={`border-b border-gray-100 hover:bg-indigo-50/40 transition-colors ${i % 2 ? 'bg-gray-50/40' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{lead.bankTitle}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.productTitle}</td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{lead.customerName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{lead.customerMobile}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{lead.bankLeadId}</td>
                  <td className="px-4 py-3">
                    <StatusBadge group={lead.canonicalGroup} status={lead.canonicalStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{lead.lastStatusUpdatedDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages} · {leads.length} leads
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded text-xs font-medium ${
                      page === p
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
