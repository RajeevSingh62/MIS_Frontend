'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey?: keyof T | ((row: T) => string | number);
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  striped?: boolean;
}

function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = 'No data available.',
  className,
  onRowClick,
  striped = true,
}: TableProps<T>) {
  const getRowKey = (row: T, index: number): string | number => {
    if (!rowKey) return index;
    if (typeof rowKey === 'function') return rowKey(row);
    return row[rowKey as keyof T] as string | number;
  };

  const alignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500',
                    alignClass(col.align)
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Loading…</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-gray-100 transition-colors duration-100',
                    striped && index % 2 !== 0 && 'bg-gray-50/60',
                    onRowClick && 'cursor-pointer hover:bg-indigo-50'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn('px-4 py-3 text-gray-700', alignClass(col.align))}
                    >
                      {col.render
                        ? col.render(row, index)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
