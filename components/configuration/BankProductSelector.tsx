'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectBanks, selectBankProducts } from '@/features/reference/reference.selectors';

interface BankProductSelectorProps {
  selectedBankId: number | null;
  selectedProductId?: number | null;
  onBankChange: (bankId: number | null) => void;
  onProductChange?: (productId: number | null) => void;
  showProduct?: boolean;
  disabled?: boolean;
}

export default function BankProductSelector({
  selectedBankId,
  selectedProductId,
  onBankChange,
  onProductChange,
  showProduct = false,
  disabled = false,
}: BankProductSelectorProps) {
  const banks = useAppSelector(selectBanks);
  const filteredProducts = useAppSelector(selectBankProducts(selectedBankId));

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Bank dropdown */}
      <div className="flex flex-col gap-1 min-w-[200px]">
        <label htmlFor="bank-selector" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Bank
        </label>
        <select
          id="bank-selector"
          value={selectedBankId ?? ''}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : null;
            onBankChange(val);
            onProductChange?.(null);
          }}
          className="rounded-lg border border-gray-300 bg-white text-sm text-gray-800 py-2 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Select bank…</option>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>{b.bank_title}</option>
          ))}
        </select>
      </div>

      {/* Product dropdown — only shown when showProduct=true */}
      {showProduct && (
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label htmlFor="product-selector" className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Product
          </label>
          <select
            id="product-selector"
            value={selectedProductId ?? ''}
            disabled={disabled || !selectedBankId}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onProductChange?.(val);
            }}
            className="rounded-lg border border-gray-300 bg-white text-sm text-gray-800 py-2 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">{selectedBankId ? 'All products' : 'Select bank first'}</option>
            {filteredProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
