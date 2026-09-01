'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loadAllUnmappedStatuses } from '@/features/exceptions/exceptions.thunk';
import { selectExceptionsLoading } from '@/features/exceptions/exceptions.slice';
import UnmappedStatusTable from '@/components/exceptions/UnmappedStatusTable';

export default function ExceptionsClient() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectExceptionsLoading);

  useEffect(() => {
    dispatch(loadAllUnmappedStatuses(undefined));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Exception Queue</h1>
        <p className="text-gray-500">Resolve unmapped statuses found in recent lead uploads.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <UnmappedStatusTable />
      )}
    </div>
  );
}
