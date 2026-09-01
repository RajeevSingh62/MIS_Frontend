import type { UnmappedStatus } from '@/features/config/config.types';

export interface ExceptionsState {
  unmappedStatuses: UnmappedStatus[];
  loading: boolean;
  error: string | null;
}
