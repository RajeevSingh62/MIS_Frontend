'use client';

import { cn } from '@/utils/cn';
import type { CanonicalGroup } from '@/data/dummyCanonicalStatuses';

interface StatusBadgeProps {
  group: CanonicalGroup;
  status?: string;
  size?: 'sm' | 'md';
}

const groupConfig: Record<CanonicalGroup, { bg: string; text: string; dot: string; label: string }> = {
  InProgress: { bg: 'bg-gray-100',  text: 'text-gray-700',  dot: 'bg-gray-500',  label: 'In Progress' },
  Completed:  { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Completed'   },
  Rejected:   { bg: 'bg-red-100',   text: 'text-red-800',   dot: 'bg-red-500',   label: 'Rejected'    },
};

export default function StatusBadge({ group, status, size = 'md' }: StatusBadgeProps) {
  const cfg = groupConfig[group];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        cfg.bg, cfg.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      {status ?? cfg.label}
    </span>
  );
}
