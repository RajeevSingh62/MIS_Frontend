'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectAllUnmappedStatuses } from '@/features/exceptions/exceptions.slice';
import { selectBanks } from '@/features/reference/reference.selectors';
import MapStatusModal from './MapStatusModal';
import { removeUnmappedStatus } from '@/features/exceptions/exceptions.slice';

export default function UnmappedStatusTable() {
  const dispatch = useAppDispatch();
  const unmapped = useAppSelector(selectAllUnmappedStatuses);
  const banks = useAppSelector(selectBanks);

  const [selectedToMap, setSelectedToMap] = useState<{
    externalStatus: string;
    externalRemark: string | null;
    bankId: number;
  } | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Unmapped Statuses</h2>
          <p className="text-sm text-gray-500">These statuses were found in recent uploads but have no mapping.</p>
        </div>
        <div className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          {unmapped.length} items to map
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-500">Bank</th>
              <th className="px-4 py-3 font-semibold text-gray-500">External Status</th>
              <th className="px-4 py-3 font-semibold text-gray-500">External Remark</th>
              <th className="px-4 py-3 font-semibold text-gray-500 text-right">Lead Count</th>
              <th className="px-4 py-3 font-semibold text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {unmapped.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  Great job! No unmapped statuses found.
                </td>
              </tr>
            ) : (
              unmapped.map((u, i) => {
                const bank = banks.find(b => b.id === u.bank_id);
                return (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{bank?.bank_title || 'Unknown Bank'}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-indigo-700">
                        {u.external_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]" title={u.external_remark || ''}>
                      {u.external_remark || '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">
                      {u.lead_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedToMap({
                          externalStatus: u.external_status,
                          externalRemark: u.external_remark,
                          bankId: u.bank_id
                        })}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        Map Status
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedToMap && (
        <MapStatusModal
          externalStatus={selectedToMap.externalStatus}
          externalRemark={selectedToMap.externalRemark}
          bankId={selectedToMap.bankId}
          onClose={() => setSelectedToMap(null)}
          onSuccess={() => {
            dispatch(removeUnmappedStatus({ 
              external_status: selectedToMap.externalStatus,
              external_remark: selectedToMap.externalRemark 
            }));
            setSelectedToMap(null);
          }}
        />
      )}
    </div>
  );
}
