'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectSelectedBankId } from '@/features/config/config.selectors';
import { setSelectedBank } from '@/features/config/config.slice';
import BankProductSelector from '@/components/configuration/BankProductSelector';
import ColumnMappingTab from '@/components/configuration/ColumnMappingTab';
import ProductMappingTab from '@/components/configuration/ProductMappingTab';
import StatusMappingTab from '@/components/configuration/StatusMappingTab';
import { cn } from '@/utils/cn';

type Tab = 'columns' | 'products' | 'statuses';

const tabs: { key: Tab; label: string }[] = [
  { key: 'columns',  label: 'Column Mapping'  },
  { key: 'products', label: 'Product Mapping' },
  { key: 'statuses', label: 'Status Mapping'  },
];

export default function ConfigurationPage() {
  const dispatch = useAppDispatch();
  const selectedBankId = useAppSelector(selectSelectedBankId);
  const [activeTab, setActiveTab] = useState<Tab>('columns');

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage column mappings, product mappings, and status mapping rules per bank.
        </p>
      </div>

      {/* Bank selector card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <BankProductSelector
          selectedBankId={selectedBankId}
          onBankChange={(id) => dispatch(setSelectedBank(id))}
        />
      </div>

      {/* Tab navigation + content */}
      {selectedBankId ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={`config-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-5 py-3.5 text-sm font-medium transition-colors relative',
                  activeTab === tab.key
                    ? 'text-indigo-700 bg-white border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5">
            {activeTab === 'columns'  && <ColumnMappingTab  bankId={selectedBankId} />}
            {activeTab === 'products' && <ProductMappingTab bankId={selectedBankId} />}
            {activeTab === 'statuses' && <StatusMappingTab  bankId={selectedBankId} />}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Select a bank to start configuring</p>
          <p className="text-sm text-gray-400 mt-1">
            Choose a bank from the dropdown above to view and edit its mapping configuration.
          </p>
        </div>
      )}
    </div>
  );
}
