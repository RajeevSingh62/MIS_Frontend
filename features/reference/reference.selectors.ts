import type { RootState } from '@/redux/store';

export const selectBanks = (state: RootState) => state.reference.banks;
export const selectProducts = (state: RootState) => state.reference.products;
export const selectLeadStatuses = (state: RootState) => state.reference.leadStatuses;
export const selectReferenceLoading = (state: RootState) => state.reference.loading;
export const selectReferenceError = (state: RootState) => state.reference.error;

// Derived: products filtered by a given bankId
export const selectBankProducts = (bankId: number | null) => (state: RootState) =>
  bankId ? state.reference.products.filter((p) => String(p.bank_id) === String(bankId)) : [];
