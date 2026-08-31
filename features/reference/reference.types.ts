export interface Bank {
  id: number;
  bank_title: string;
}

export interface Product {
  id: number;
  title: string;
  bank_id: number;
}

export interface LeadStatus {
  id: number;
  title: string;
  parent_id: number | null;
  product_id: number | null;
}

export interface ReferenceState {
  banks: Bank[];
  products: Product[];
  leadStatuses: LeadStatus[];
  loading: boolean;
  error: string | null;
}
