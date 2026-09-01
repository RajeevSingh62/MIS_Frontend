export interface BankExcelConfig {
  id: number;
  bank_id: number;
  product_id: number | null;
  lead_identifier_column: string;
  status_column: string;
  remark_column: string | null;
  application_no_column: string | null;
  product_name_column: string | null;
  sheet_name: string | null;
  header_row: number;
  is_active: boolean;
  bank?: { id: number; bank_title: string };
  product?: { id: number; title: string };
}

export interface StatusMappingRule {
  id: number;
  bank_id: number;
  product_id: number | null;
  external_status: string;
  external_remark: string | null;
  internal_status_id: number;
  priority: number;
  is_active: boolean;
  internal_status?: { id: number; title: string };
  bank?: { id: number; bank_title: string };
  product?: { id: number; title: string };
}

export interface UnmappedStatus {
  external_status: string;
  external_remark: string | null;
  lead_count: number;
  bank_id: number;
}

export interface ConfigState {
  selectedBankId: number | null;
  excelConfigs: BankExcelConfig[];
  statusMappingRules: StatusMappingRule[];
  unmappedStatuses: UnmappedStatus[];
  loading: boolean;
  error: string | null;
}
