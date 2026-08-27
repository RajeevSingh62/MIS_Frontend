import type { ColumnMapping } from '@/data/dummyColumnMappings';
import type { ProductMapping, UnmappedProduct } from '@/data/dummyProductMappings';
import type { StatusMappingRule, UnmappedStatus } from '@/data/dummyStatusMappingRules';

export type { ColumnMapping };
export type { ProductMapping, UnmappedProduct };
export type { StatusMappingRule, UnmappedStatus };

export interface ConfigState {
  selectedBankId: number | null;
  columnMappings: ColumnMapping[];
  productMappings: ProductMapping[];
  unmappedProducts: UnmappedProduct[];
  statusMappingRules: StatusMappingRule[];
  unmappedStatuses: UnmappedStatus[];
  loading: boolean;
  error: string | null;
}
