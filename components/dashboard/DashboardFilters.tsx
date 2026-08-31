'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectDashboardFilters } from '@/features/dashboard/dashboard.selectors';
import { setFilters, resetFilters } from '@/features/dashboard/dashboard.slice';
import { selectBanks, selectBankProducts } from '@/features/reference/reference.selectors';
import type { CanonicalGroup } from '@/data/dummyCanonicalStatuses';
import Button from '@/components/ui/Button';

export default function DashboardFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectDashboardFilters);

  const banks = useAppSelector(selectBanks);
  const bankProducts = useAppSelector(selectBankProducts(filters.bankId));

  const statusGroups: Array<{ label: string; value: CanonicalGroup | 'All' }> = [
    { label: 'All Groups', value: 'All' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  const sel = 'rounded-lg border border-gray-300 bg-white text-sm text-gray-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
      <div className="flex flex-wrap items-end gap-3">
        {/* Bank */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bank</label>
          <select
            id="dash-filter-bank"
            value={filters.bankId ?? ''}
            onChange={(e) =>
              dispatch(setFilters({ bankId: e.target.value ? Number(e.target.value) : null }))
            }
            className={sel}
          >
            <option value="">All Banks</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>{b.bank_title}</option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product</label>
          <select
            id="dash-filter-product"
            value={filters.productId ?? ''}
            disabled={!filters.bankId}
            onChange={(e) =>
              dispatch(setFilters({ productId: e.target.value ? Number(e.target.value) : null }))
            }
            className={sel + ' disabled:bg-gray-50 disabled:text-gray-400'}
          >
            <option value="">{filters.bankId ? 'All Products' : 'Select bank first'}</option>
            {bankProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Status Group */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status Group</label>
          <select
            id="dash-filter-status-group"
            value={filters.statusGroup}
            onChange={(e) =>
              dispatch(setFilters({ statusGroup: e.target.value as CanonicalGroup | 'All' }))
            }
            className={sel}
          >
            {statusGroups.map((sg) => (
              <option key={sg.value} value={sg.value}>{sg.label}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">From</label>
          <input
            id="dash-filter-date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => dispatch(setFilters({ dateFrom: e.target.value }))}
            className={sel}
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">To</label>
          <input
            id="dash-filter-date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => dispatch(setFilters({ dateTo: e.target.value }))}
            className={sel}
          />
        </div>

        {/* Reset */}
        <Button
          id="dash-filter-reset-btn"
          variant="ghost"
          size="sm"
          onClick={() => dispatch(resetFilters())}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
