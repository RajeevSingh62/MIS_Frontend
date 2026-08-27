'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectStatusMappingRules,
  selectUnmappedStatuses,
  selectConfigLoading,
} from '@/features/config/config.selectors';
import {
  loadStatusMappings,
  addStatusRule,
  removeStatusRule,
} from '@/features/config/config.thunk';
import { canonicalStatusFlat, canonicalStatusGroups } from '@/data/dummyCanonicalStatuses';
import type { CanonicalGroup } from '@/data/dummyCanonicalStatuses';
import type { StatusMappingRule } from '@/data/dummyStatusMappingRules';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface StatusMappingTabProps {
  bankId: number;
}

interface PendingRule {
  canonicalStatus: string;
  canonicalGroup: CanonicalGroup | '';
}

const emptyNewRule = {
  sourceStatus: '',
  sourceSubStatus: '',
  remarkPattern: '',
  canonicalStatus: '',
  canonicalGroup: '' as CanonicalGroup | '',
};

export default function StatusMappingTab({ bankId }: StatusMappingTabProps) {
  const dispatch = useAppDispatch();
  const rules = useAppSelector(selectStatusMappingRules);
  const unmapped = useAppSelector(selectUnmappedStatuses);
  const loading = useAppSelector(selectConfigLoading);

  const [pendingRules, setPendingRules] = useState<Record<string, PendingRule>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [newRule, setNewRule] = useState(emptyNewRule);

  useEffect(() => {
    dispatch(loadStatusMappings(bankId));
    setPendingRules({});
  }, [bankId, dispatch]);

  const handlePendingChange = (key: string, canonicalStatus: string) => {
    const found = canonicalStatusFlat.find((s) => s.status === canonicalStatus);
    setPendingRules((prev) => ({
      ...prev,
      [key]: {
        canonicalStatus,
        canonicalGroup: found?.group ?? '',
      },
    }));
  };

  const handleSaveUnmapped = (
    sourceStatus: string,
    sourceSubStatus: string,
    remarkPattern: string
  ) => {
    const key = `${sourceStatus}|${sourceSubStatus}`;
    const pending = pendingRules[key];
    if (!pending?.canonicalStatus || !pending.canonicalGroup) return;
    dispatch(
      addStatusRule({
        bankId,
        rule: {
          sourceStatus,
          sourceSubStatus,
          remarkPattern,
          canonicalStatus: pending.canonicalStatus,
          canonicalGroup: pending.canonicalGroup as CanonicalGroup,
        },
      })
    );
  };

  const handleAddNew = () => {
    if (!newRule.sourceStatus || !newRule.canonicalStatus || !newRule.canonicalGroup) return;
    dispatch(
      addStatusRule({
        bankId,
        rule: {
          sourceStatus: newRule.sourceStatus,
          sourceSubStatus: newRule.sourceSubStatus,
          remarkPattern: newRule.remarkPattern,
          canonicalStatus: newRule.canonicalStatus,
          canonicalGroup: newRule.canonicalGroup as CanonicalGroup,
        },
      })
    );
    setNewRule(emptyNewRule);
    setModalOpen(false);
  };

  const canonicalSelect = (value: string, onChange: (v: string) => void, id: string) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white text-sm text-gray-800 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
    >
      <option value="">Select canonical status…</option>
      {(Object.keys(canonicalStatusGroups) as CanonicalGroup[]).map((group) => (
        <optgroup key={group} label={group}>
          {canonicalStatusGroups[group].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );

  if (loading && rules.length === 0 && unmapped.length === 0) {
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
      {/* Unmapped statuses */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Unmapped Status Combinations
          <span className="ml-1 rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-0.5">
            {unmapped.length}
          </span>
        </h3>
        {unmapped.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl">
            No unmapped status combinations for this bank. 🎉
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Status', 'Sub Status', 'Remark', 'Leads', 'Canonical Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unmapped.map((item, i) => {
                  const key = `${item.sourceStatus}|${item.sourceSubStatus}`;
                  const pending = pendingRules[key];
                  return (
                    <tr key={key} className={`border-b border-gray-100 ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{item.sourceStatus}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{item.sourceSubStatus || '—'}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{item.remarkPattern || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500">{item.leadCount}</td>
                      <td className="px-4 py-2.5 min-w-[240px]">
                        {canonicalSelect(
                          pending?.canonicalStatus ?? '',
                          (v) => handlePendingChange(key, v),
                          `cs-${key}`
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <Button
                          size="sm"
                          disabled={!pending?.canonicalStatus}
                          onClick={() =>
                            handleSaveUnmapped(item.sourceStatus, item.sourceSubStatus, item.remarkPattern)
                          }
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Existing rules */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Existing Rules
            <span className="ml-1 rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5">
              {rules.length}
            </span>
          </h3>
          <Button
            id="add-status-rule-btn"
            size="sm"
            variant="secondary"
            onClick={() => setModalOpen(true)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add New Rule
          </Button>
        </div>
        {rules.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl">
            No rules configured yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Source Status', 'Sub Status', 'Remark Pattern', 'Canonical Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, i) => (
                  <tr key={rule.id} className={`border-b border-gray-100 ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{rule.sourceStatus}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{rule.sourceSubStatus || '—'}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{rule.remarkPattern || '—'}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge group={rule.canonicalGroup} status={rule.canonicalStatus} />
                    </td>
                    <td className="px-4 py-2.5">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          dispatch(
                            removeStatusRule({
                              id: rule.id,
                              sourceStatus: rule.sourceStatus,
                              sourceSubStatus: rule.sourceSubStatus,
                            })
                          )
                        }
                      >
                        Remove
                      </Button>
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
        title="Add New Status Mapping Rule"
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!newRule.sourceStatus || !newRule.canonicalStatus}
              onClick={handleAddNew}
            >
              Add Rule
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Source Status *</label>
              <input
                type="text"
                value={newRule.sourceStatus}
                onChange={(e) => setNewRule((r) => ({ ...r, sourceStatus: e.target.value }))}
                placeholder="e.g. ACTIVE"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Source Sub Status</label>
              <input
                type="text"
                value={newRule.sourceSubStatus}
                onChange={(e) => setNewRule((r) => ({ ...r, sourceSubStatus: e.target.value }))}
                placeholder="e.g. KYC DONE"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Remark Pattern (regex, optional)</label>
            <input
              type="text"
              value={newRule.remarkPattern}
              onChange={(e) => setNewRule((r) => ({ ...r, remarkPattern: e.target.value }))}
              placeholder="e.g. CIBIL.*"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Canonical Status *</label>
            {canonicalSelect(newRule.canonicalStatus, (v) => {
              const found = canonicalStatusFlat.find((s) => s.status === v);
              setNewRule((r) => ({
                ...r,
                canonicalStatus: v,
                canonicalGroup: found?.group ?? '',
              }));
            }, 'new-rule-canonical')}
          </div>
          {newRule.canonicalGroup && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Group: <StatusBadge group={newRule.canonicalGroup as CanonicalGroup} />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
