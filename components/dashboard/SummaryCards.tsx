'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectFilteredLeads } from '@/features/dashboard/dashboard.selectors';

interface CardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: 'gray' | 'blue' | 'green' | 'red' | 'amber';
  icon: React.ReactNode;
}

const colorMap: Record<CardProps['color'], { bg: string; text: string; iconBg: string }> = {
  gray:  { bg: 'bg-white', text: 'text-gray-900', iconBg: 'bg-gray-100' },
  blue:  { bg: 'bg-white', text: 'text-blue-700',  iconBg: 'bg-blue-50' },
  green: { bg: 'bg-white', text: 'text-green-700', iconBg: 'bg-green-50' },
  red:   { bg: 'bg-white', text: 'text-red-700',   iconBg: 'bg-red-50'  },
  amber: { bg: 'bg-white', text: 'text-amber-700', iconBg: 'bg-amber-50' },
};

function MetricCard({ label, value, sub, color, icon }: CardProps) {
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
        <span className={c.text}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${c.text}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const leads = useAppSelector(selectFilteredLeads);

  const summary = useMemo(() => {
    const total = leads.length;
    const inProgress = leads.filter((l) => l.canonicalGroup === 'InProgress').length;
    const completed  = leads.filter((l) => l.canonicalGroup === 'Completed').length;
    const rejected   = leads.filter((l) => l.canonicalGroup === 'Rejected').length;
    const payoutPending = leads
      .filter((l) => l.canonicalStatus === 'TASK COMPLETE - PAYOUT PENDING')
      .reduce((sum, l) => sum + l.leadPayout, 0);
    return { total, inProgress, completed, rejected, payoutPending };
  }, [leads]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <MetricCard
        label="Total Leads"
        value={summary.total}
        color="gray"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
      />
      <MetricCard
        label="In Progress"
        value={summary.inProgress}
        sub={summary.total ? `${((summary.inProgress / summary.total) * 100).toFixed(0)}% of total` : undefined}
        color="blue"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <MetricCard
        label="Completed"
        value={summary.completed}
        sub={summary.total ? `${((summary.completed / summary.total) * 100).toFixed(0)}% of total` : undefined}
        color="green"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <MetricCard
        label="Rejected"
        value={summary.rejected}
        sub={summary.total ? `${((summary.rejected / summary.total) * 100).toFixed(0)}% of total` : undefined}
        color="red"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <MetricCard
        label="Payout Pending"
        value={`₹${summary.payoutPending.toLocaleString('en-IN')}`}
        sub="TASK COMPLETE - PAYOUT PENDING"
        color="amber"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
    </div>
  );
}
