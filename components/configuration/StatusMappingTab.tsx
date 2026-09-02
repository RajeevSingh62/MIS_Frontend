'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectStatusMappingRules,
  selectUnmappedStatuses,
  selectConfigLoading,
} from '@/features/config/config.selectors';
import { selectProducts, selectLeadStatuses } from '@/features/reference/reference.selectors';
import {
  loadStatusMappings,
  addOrUpdateStatusRule,
  removeStatusRule,
} from '@/features/config/config.thunk';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { StatusMappingRule } from '@/features/config/config.types';

interface StatusMappingTabProps {
  bankId: number;
}

const emptyRule: Partial<StatusMappingRule> = {
  product_id: null,
  external_status: '',
  external_remark: '',
  internal_status_id: 0,
  priority: 4,
  is_active: true,
};


export default function StatusMappingTab({ bankId }: StatusMappingTabProps) {
  const dispatch = useAppDispatch();
  const rules = useAppSelector(selectStatusMappingRules);
  const unmapped = useAppSelector(selectUnmappedStatuses);
  const loading = useAppSelector(selectConfigLoading);
  const products = useAppSelector(selectProducts).filter(p => p.bank_id === bankId);
  const leadStatuses = useAppSelector(selectLeadStatuses);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<StatusMappingRule>>(emptyRule);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(loadStatusMappings(bankId));
  }, [bankId, dispatch]);

  const handleSave = async () => {
    await dispatch(addOrUpdateStatusRule({ ...editingRule, bank_id: bankId })).unwrap();
    setModalOpen(false);
    setEditingRule(emptyRule);
  };

  const handleEdit = (rule: StatusMappingRule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleDelete = (rule: StatusMappingRule) => {
    if (confirm('Are you sure you want to delete this mapping?')) {
      dispatch(
        removeStatusRule({
          id: rule.id,
          external_status: rule.external_status,
          external_remark: rule.external_remark,
        })
      );
    }
  };

  const filteredRules = rules.filter(r => 
    r.external_status.toLowerCase().includes(search.toLowerCase()) || 
    (r.external_remark && r.external_remark.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading && rules.length === 0) {
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
      {/* Existing rules */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Status Mappings
              <span className="ml-1 rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5">
                {rules.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500">Map bank-specific statuses to your internal lead statuses.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search statuses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
            <Button
              size="sm"
              onClick={() => {
                setEditingRule(emptyRule);
                setModalOpen(true);
              }}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Add Mapping
            </Button>
          </div>
        </div>

        {filteredRules.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl">
            {search ? 'No mappings match your search.' : 'No mappings configured yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">External Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">External Remark</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Product Scope</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Internal Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 bg-indigo-50/50 rounded ml-4 my-1 inline-block border border-indigo-100">
                      {rule.external_status}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 max-w-[200px] truncate" title={rule.external_remark || ''}>
                      {rule.external_remark || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600">
                      {rule.product?.title || 'All Products'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        {rule.internal_status?.title || leadStatuses.find(s => s.id === Number(rule.internal_status_id))?.title || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(rule)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Edit</button>
                        <button onClick={() => handleDelete(rule)} className="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add New Rule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRule.id ? "Edit Status Mapping" : "Add Status Mapping"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!editingRule.external_status || !editingRule.internal_status_id}
              onClick={handleSave}
            >
              Save Mapping
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">External Status *</label>
              <input
                type="text"
                value={editingRule.external_status || ''}
                onChange={(e) => setEditingRule({ ...editingRule, external_status: e.target.value })}
                placeholder="e.g. APPROVED"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">External Remark (Optional)</label>
              <input
                type="text"
                value={editingRule.external_remark || ''}
                onChange={(e) => setEditingRule({ ...editingRule, external_remark: e.target.value })}
                placeholder="e.g. KYC DONE"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Internal Status *</label>
            <select
              value={editingRule.internal_status_id || ''}
              onChange={(e) => setEditingRule({ ...editingRule, internal_status_id: Number(e.target.value) })}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Select internal status...</option>
              {leadStatuses.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Product Scope (Optional)</label>
            <select
              value={editingRule.product_id || ''}
              onChange={(e) => setEditingRule({ ...editingRule, product_id: e.target.value ? Number(e.target.value) : null })}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Apply to all products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
