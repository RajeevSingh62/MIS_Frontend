'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectFilteredLeads } from '@/features/dashboard/dashboard.selectors';
import { canonicalStatusGroups } from '@/data/dummyCanonicalStatuses';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#a78bfa', '#60a5fa', '#34d399'];

export default function RejectionBreakdownChart() {
  const leads = useAppSelector(selectFilteredLeads);

  const data = useMemo(() => {
    const rejectedStatuses = canonicalStatusGroups.Rejected;
    return rejectedStatuses
      .map((status) => ({
        name: status.replace(' REJECT', '').replace('REJECT', '').trim(),
        fullName: status,
        value: leads.filter((l) => l.canonicalStatus === status).length,
      }))
      .filter((d) => d.value > 0);
  }, [leads]);

  const totalRejected = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Rejection Breakdown</h3>
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          No rejected leads match the current filters.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Rejection Breakdown</h3>
        <span className="text-xs bg-red-50 text-red-700 rounded-full px-2 py-0.5 font-medium">
          {totalRejected} total
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, props) => [value, props.payload.fullName]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 11, color: '#4b5563' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
