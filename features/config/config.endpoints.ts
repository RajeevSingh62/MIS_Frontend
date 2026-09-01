import axiosInstance from '@/lib/axiosInstance';
import type { BankExcelConfig, StatusMappingRule, UnmappedStatus } from './config.types';

// ─── Excel Configs ────────────────────────────────────────────────────────
export async function fetchExcelConfigs(bankId: number): Promise<BankExcelConfig[]> {
  const { data } = await axiosInstance.get(`/api/v1/excel-configs?bank_id=${bankId}`);
  return data;
}

export async function saveExcelConfig(config: Partial<BankExcelConfig>): Promise<BankExcelConfig> {
  if (config.id) {
    const { data } = await axiosInstance.put(`/api/v1/excel-configs/${config.id}`, config);
    return data;
  } else {
    const { data } = await axiosInstance.post('/api/v1/excel-configs', config);
    return data;
  }
}

export async function deleteExcelConfig(id: number): Promise<void> {
  await axiosInstance.delete(`/api/v1/excel-configs/${id}`);
}

// ─── Status Mapping Rules ─────────────────────────────────────────────────────
export async function fetchStatusMappings(bankId: number): Promise<{
  rules: StatusMappingRule[];
  unmapped: UnmappedStatus[];
}> {
  // Fetch both concurrently
  const [rulesRes, unmappedRes] = await Promise.all([
    axiosInstance.get(`/api/v1/status-mappings?bank_id=${bankId}`),
    axiosInstance.get(`/api/v1/status-mappings/unmapped?bank_id=${bankId}`),
  ]);

  return {
    rules: rulesRes.data.data || [],
    unmapped: unmappedRes.data || [],
  };
}

export async function saveStatusRule(
  rule: Partial<StatusMappingRule>
): Promise<StatusMappingRule> {
  if (rule.id) {
    const { data } = await axiosInstance.put(`/api/v1/status-mappings/${rule.id}`, rule);
    return data;
  } else {
    const { data } = await axiosInstance.post('/api/v1/status-mappings', rule);
    return data;
  }
}

export async function deleteStatusRule(id: number): Promise<void> {
  await axiosInstance.delete(`/api/v1/status-mappings/${id}`);
}
