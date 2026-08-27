import type { CanonicalGroup } from './dummyCanonicalStatuses';

export interface StatusMappingRule {
  id: number;
  sourceStatus: string;
  sourceSubStatus: string;
  remarkPattern: string;
  canonicalStatus: string;
  canonicalGroup: CanonicalGroup;
}

export interface UnmappedStatus {
  sourceStatus: string;
  sourceSubStatus: string;
  remarkPattern: string;
  leadCount: number;
}

export const dummyStatusMappingRules: Record<number, StatusMappingRule[]> = {
  1: [ // HDFC
    { id: 1,  sourceStatus: 'ACTIVE',     sourceSubStatus: 'PROFILE CREATED',   remarkPattern: '',             canonicalStatus: 'LEAD ADDED',              canonicalGroup: 'InProgress' },
    { id: 2,  sourceStatus: 'ACTIVE',     sourceSubStatus: 'SIGNUP IN PROGRESS', remarkPattern: '',             canonicalStatus: 'SIGNUP PENDING',          canonicalGroup: 'InProgress' },
    { id: 3,  sourceStatus: 'ACTIVE',     sourceSubStatus: 'SIGNUP DONE',        remarkPattern: '',             canonicalStatus: 'SIGNUP COMPLETED',        canonicalGroup: 'InProgress' },
    { id: 4,  sourceStatus: 'REJECTED',   sourceSubStatus: 'LOW CIBIL',          remarkPattern: '',             canonicalStatus: 'CIBIL REJECT',            canonicalGroup: 'Rejected' },
    { id: 5,  sourceStatus: 'REJECTED',   sourceSubStatus: 'INVALID PINCODE',    remarkPattern: '',             canonicalStatus: 'PINCODE REJECT',          canonicalGroup: 'Rejected' },
    { id: 6,  sourceStatus: 'COMPLETED',  sourceSubStatus: 'DISBURSED',          remarkPattern: '',             canonicalStatus: 'TASK COMPLETE - PAYOUT PENDING', canonicalGroup: 'Completed' },
  ],
  2: [ // Kotak
    { id: 7,  sourceStatus: 'NEW',        sourceSubStatus: 'INITIATED',          remarkPattern: '',             canonicalStatus: 'LEAD ADDED',              canonicalGroup: 'InProgress' },
    { id: 8,  sourceStatus: 'PROCESSING', sourceSubStatus: 'DOC REQUIRED',       remarkPattern: '',             canonicalStatus: 'DOCUMENT PENDING',        canonicalGroup: 'InProgress' },
    { id: 9,  sourceStatus: 'DECLINED',   sourceSubStatus: 'BUREAU REJECT',      remarkPattern: 'CIBIL.*',      canonicalStatus: 'CIBIL REJECT',            canonicalGroup: 'Rejected' },
    { id: 10, sourceStatus: 'APPROVED',   sourceSubStatus: 'CARD DISPATCHED',    remarkPattern: '',             canonicalStatus: 'TASK COMPLETE - PAYOUT PENDING', canonicalGroup: 'Completed' },
  ],
  3: [ // ICICI
    { id: 11, sourceStatus: 'OPEN',       sourceSubStatus: 'LEAD CREATED',       remarkPattern: '',             canonicalStatus: 'LEAD ADDED',              canonicalGroup: 'InProgress' },
    { id: 12, sourceStatus: 'OPEN',       sourceSubStatus: 'VKYC INITIATED',     remarkPattern: '',             canonicalStatus: 'VKYC PENDING',            canonicalGroup: 'InProgress' },
    { id: 13, sourceStatus: 'CLOSED',     sourceSubStatus: 'PAID OUT',           remarkPattern: '',             canonicalStatus: 'TASK COMPLETE - PAYOUT RELEASED', canonicalGroup: 'Completed' },
    { id: 14, sourceStatus: 'REJECTED',   sourceSubStatus: 'DUPLICATE',          remarkPattern: '',             canonicalStatus: 'DUPLICATE REJECT',        canonicalGroup: 'Rejected' },
  ],
  4: [],
  5: [
    { id: 15, sourceStatus: 'PENDING',    sourceSubStatus: 'CREATED',            remarkPattern: '',             canonicalStatus: 'LEAD ADDED',              canonicalGroup: 'InProgress' },
  ],
  6: [
    { id: 16, sourceStatus: 'ACTIVE',     sourceSubStatus: 'IN-PROCESS',         remarkPattern: '',             canonicalStatus: 'UNDERWRITER PENDING',     canonicalGroup: 'InProgress' },
  ],
};

export const dummyUnmappedStatuses: Record<number, UnmappedStatus[]> = {
  1: [
    { sourceStatus: 'ACTIVE',   sourceSubStatus: 'UNDERWRITING',    remarkPattern: '',        leadCount: 12 },
    { sourceStatus: 'HOLD',     sourceSubStatus: 'QUERY RAISED',    remarkPattern: '',        leadCount: 5  },
  ],
  2: [
    { sourceStatus: 'PENDING',  sourceSubStatus: 'CREDIT CHECK',    remarkPattern: '',        leadCount: 8  },
    { sourceStatus: 'DECLINED', sourceSubStatus: 'ELIGIBILITY',     remarkPattern: '',        leadCount: 3  },
  ],
  3: [
    { sourceStatus: 'OPEN',     sourceSubStatus: 'UW IN PROGRESS',  remarkPattern: '',        leadCount: 7  },
  ],
  4: [
    { sourceStatus: 'NEW',      sourceSubStatus: 'CREATED',         remarkPattern: '',        leadCount: 19 },
    { sourceStatus: 'REJECT',   sourceSubStatus: 'PINCODE',         remarkPattern: '',        leadCount: 4  },
  ],
  5: [],
  6: [
    { sourceStatus: 'CLOSED',   sourceSubStatus: 'DISBURSED',       remarkPattern: '',        leadCount: 11 },
  ],
};
