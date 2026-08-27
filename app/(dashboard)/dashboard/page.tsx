'use client';

import DashboardFilters from '@/components/dashboard/DashboardFilters';
import SummaryCards from '@/components/dashboard/SummaryCards';
import FunnelChart from '@/components/dashboard/FunnelChart';
import RejectionBreakdownChart from '@/components/dashboard/RejectionBreakdownChart';
import RecentLeadsTable from '@/components/dashboard/RecentLeadsTable';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time MIS reporting across all partner bank leads.
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters />

      {/* Summary cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart />
        <RejectionBreakdownChart />
      </div>

      {/* Leads table */}
      <RecentLeadsTable />
    </div>
  );
}
