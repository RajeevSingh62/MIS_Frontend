'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectExcelConfigs, selectConfigLoading } from '@/features/config/config.selectors';
import { loadExcelConfigs, addOrUpdateExcelConfig, removeExcelConfig } from '@/features/config/config.thunk';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { selectProducts } from '@/features/reference/reference.selectors';
import type { BankExcelConfig } from '@/features/config/config.types';

interface ExcelConfigTabProps {
  bankId: number;
}

const emptyConfig: Partial<BankExcelConfig> = {
  product_id: null,
  lead_identifier_column: 'leadcode',
  status_column: 'leadstatus_id',
  remark_column: null,
  application_no_column: null,
  product_name_column: null,
  sheet_name: null,
  header_row: 1,
  is_active: true,
};

export default function ExcelConfigTab({ bankId }: ExcelConfigTabProps) {
  const dispatch = useAppDispatch();
  const configs = useAppSelector(selectExcelConfigs);
  const loading = useAppSelector(selectConfigLoading);
  const products = useAppSelector(selectProducts).filter(p => p.bank_id === bankId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Partial<BankExcelConfig>>(emptyConfig);

  useEffect(() => {
    dispatch(loadExcelConfigs(bankId));
  }, [bankId, dispatch]);

  const handleSave = async () => {
    await dispatch(addOrUpdateExcelConfig({ ...editingConfig, bank_id: bankId })).unwrap();
    setModalOpen(false);
    setEditingConfig(emptyConfig);
  };

  const handleEdit = (config: BankExcelConfig) => {
    setEditingConfig(config);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this Excel configuration?')) {
      dispatch(removeExcelConfig(id));
    }
  };

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
        <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Excel Configurations</h3>
          <p className="text-xs text-gray-500 mt-1">Map column headers from the bank's Excel file to internal system fields.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingConfig(emptyConfig);
            setModalOpen(true);
          }}
        >
          Add Configuration
        </Button>
      </div>

      {configs.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
          <p className="text-sm text-gray-500 font-medium">No Excel configurations found for this bank.</p>
          <p className="text-xs text-gray-400 mt-1">Add a configuration to enable automated file parsing.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-600">Product</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Lead ID Col</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status Col</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Remark Col</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Header Row</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {configs.map((config) => (
                <tr key={config.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {config.product?.title || <span className="text-indigo-600 text-xs bg-indigo-50 px-2 py-0.5 rounded-full">All Products (Fallback)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs bg-gray-50 rounded mx-1">{config.lead_identifier_column}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs bg-gray-50 rounded mx-1">{config.status_column}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{config.remark_column || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-center">{config.header_row}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(config)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(config.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingConfig.id ? "Edit Excel Configuration" : "Add Excel Configuration"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!editingConfig.lead_identifier_column || !editingConfig.status_column}>
              Save Configuration
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Product Scope</label>
            <select
              value={editingConfig.product_id || ''}
              onChange={(e) => setEditingConfig({ ...editingConfig, product_id: e.target.value ? Number(e.target.value) : null })}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Fallback for all products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500">Select a specific product, or leave blank to use this as the default config for the bank.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Lead ID Column Header *</label>
              <input
                type="text"
                value={editingConfig.lead_identifier_column || ''}
                onChange={(e) => setEditingConfig({ ...editingConfig, lead_identifier_column: e.target.value })}
                className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="e.g. leadcode"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Status Column Header *</label>
              <input
                type="text"
                value={editingConfig.status_column || ''}
                onChange={(e) => setEditingConfig({ ...editingConfig, status_column: e.target.value })}
                className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="e.g. status"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Remark Column Header (Optional)</label>
              <input
                type="text"
                value={editingConfig.remark_column || ''}
                onChange={(e) => setEditingConfig({ ...editingConfig, remark_column: e.target.value })}
                className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="e.g. remarks"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Header Row Number</label>
              <input
                type="number"
                min="1"
                value={editingConfig.header_row || 1}
                onChange={(e) => setEditingConfig({ ...editingConfig, header_row: Number(e.target.value) })}
                className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Sheet Name (Optional)</label>
            <input
              type="text"
              value={editingConfig.sheet_name || ''}
              onChange={(e) => setEditingConfig({ ...editingConfig, sheet_name: e.target.value })}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Leave blank for first sheet"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
