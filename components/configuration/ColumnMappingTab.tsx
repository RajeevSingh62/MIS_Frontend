'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectColumnMappings, selectConfigLoading } from '@/features/config/config.selectors';
import { loadColumnMappings, persistColumnMappings } from '@/features/config/config.thunk';
import { updateColumnMapping } from '@/features/config/config.slice';
import Button from '@/components/ui/Button';

interface ColumnMappingTabProps {
  bankId: number;
}

export default function ColumnMappingTab({ bankId }: ColumnMappingTabProps) {
  const dispatch = useAppDispatch();
  const mappings = useAppSelector(selectColumnMappings);
  const loading = useAppSelector(selectConfigLoading);

  useEffect(() => {
    dispatch(loadColumnMappings(bankId));
  }, [bankId, dispatch]);

  const handleSave = () => {
    dispatch(persistColumnMappings({ bankId, mappings })).then(() => {
      alert('Column mappings saved successfully!');
    });
  };

  if (loading && mappings.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
        <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading mappings…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Map each standard field to the corresponding source column name in the bank's Excel file.
        </p>
        <Button
          id="save-column-mappings-btn"
          size="sm"
          loading={loading}
          onClick={handleSave}
          disabled={mappings.length === 0}
        >
          Save Mappings
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-1/2">
                Standard Field
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-1/2">
                Source Column (Bank Excel)
              </th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((mapping, index) => (
              <tr
                key={mapping.targetField}
                className={`border-b border-gray-100 ${index % 2 !== 0 ? 'bg-gray-50/50' : ''}`}
              >
                <td className="px-4 py-2.5">
                  <span className="font-medium text-gray-800">{mapping.targetField}</span>
                  {!mapping.sourceColumn && (
                    <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      Unmapped
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={mapping.sourceColumn}
                    placeholder="Enter column name…"
                    onChange={(e) =>
                      dispatch(updateColumnMapping({ index, sourceColumn: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </td>
              </tr>
            ))}
            {mappings.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-10 text-center text-gray-400">
                  Select a bank above to view and edit column mappings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
