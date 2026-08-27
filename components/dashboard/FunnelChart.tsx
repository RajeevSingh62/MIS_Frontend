'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectFilteredLeads } from '@/features/dashboard/dashboard.selectors';
import { canonicalStatusGroups } from '@/data/dummyCanonicalStatuses';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const INDIGO = '#6366f1';
const INDIGO_LIGHT = '#a5b4fc';

export default function FunnelChart() {
  const leads = useAppSelector(selectFilteredLeads);

  const data = useMemo(() => {
    const stages = canonicalStatusGroups.InProgress;
    return stages.map((stage) => ({
      name: stage
        .replace('SIGNUP', 'SIGNUP')
        .replace('UNDERWRITER', 'UW')
        .replace('DOCUMENT', 'DOC'),
      fullName: stage,
      count: leads.filter((l) => l.canonicalStatus === stage).length,
    }));
  }, [leads]);

  const max = Math.max(...data.map((d) => d.count), 1);

  if (data.every((d) => d.count === 0)) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">In-Progress Funnel</h3>
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          No in-progress leads match the current filters.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">In-Progress Funnel</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="#f3f4f6" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, _name, props) => [value, props.payload.fullName]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.count === max ? INDIGO : INDIGO_LIGHT}
                opacity={0.7 + (entry.count / max) * 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
