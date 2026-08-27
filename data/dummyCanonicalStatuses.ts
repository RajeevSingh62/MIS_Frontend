export type CanonicalGroup = 'InProgress' | 'Completed' | 'Rejected';

export interface CanonicalStatusFlat {
  status: string;
  group: CanonicalGroup;
}

export const canonicalStatusGroups: Record<CanonicalGroup, string[]> = {
  InProgress: [
    'LEAD ADDED',
    'SIGNUP PENDING',
    'SIGNUP COMPLETED',
    'VKYC PENDING',
    'VKYC COMPLETED',
    'UNDERWRITER PENDING',
    'DOCUMENT PENDING',
  ],
  Completed: [
    'TASK COMPLETE - PAYOUT PENDING',
    'TASK COMPLETE - PAYOUT RELEASED',
  ],
  Rejected: [
    'PINCODE REJECT',
    'CIBIL REJECT',
    'ELIGIBILITY REJECT',
    'DOCUMENT REJECT',
    'DUPLICATE REJECT',
    'INTERNAL REJECT',
  ],
};

// Flat list for dropdowns
export const canonicalStatusFlat: CanonicalStatusFlat[] = (
  Object.entries(canonicalStatusGroups) as [CanonicalGroup, string[]][]
).flatMap(([group, statuses]) =>
  statuses.map((status) => ({ status, group }))
);
