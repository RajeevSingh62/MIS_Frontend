'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectProductMappings,
  selectUnmappedProducts,
  selectConfigLoading,
} from '@/features/config/config.selectors';
import {
  loadProductMappings,
  addProductMapping,
  removeProductMapping,
} from '@/features/config/config.thunk';
import { selectBankProducts } from '@/features/reference/reference.selectors';
import Button from '@/components/ui/Button';

interface ProductMappingTabProps {
  bankId: number;
}

export default function ProductMappingTab({ bankId }: ProductMappingTabProps) {
  const dispatch = useAppDispatch();
  const mappings = useAppSelector(selectProductMappings);
  const unmapped = useAppSelector(selectUnmappedProducts);
  const loading = useAppSelector(selectConfigLoading);

  const [pendingSelections, setPendingSelections] = useState<Record<string, number>>({});
  const bankProducts = useAppSelector(selectBankProducts(bankId));

  useEffect(() => {
    dispatch(loadProductMappings(bankId));
    setPendingSelections({});
  }, [bankId, dispatch]);

  const handleSave = (sourceProductName: string) => {
    const productId = pendingSelections[sourceProductName];
    if (!productId) return;
    const product = bankProducts.find((p) => p.id === productId);
    if (!product) return;
    dispatch(
      addProductMapping({
        bankId,
        sourceProductName,
        productId,
        productTitle: product.title,
      })
    );
  };

  if (loading && mappings.length === 0 && unmapped.length === 0) {
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
      {/* Unmapped products */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Unmapped Product Strings
          <span className="ml-1 rounded-full bg-amber-100 text-amber-700 text-xs px-2 py-0.5">
            {unmapped.length}
          </span>
        </h3>
        {unmapped.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl">
            No unmapped products for this bank. 🎉
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Source Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Leads</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Map To Product</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {unmapped.map((item, i) => (
                  <tr key={item.sourceProductName} className={`border-b border-gray-100 ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{item.sourceProductName}</td>
                    <td className="px-4 py-2.5 text-gray-500">{item.leadCount}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={pendingSelections[item.sourceProductName] ?? ''}
                        onChange={(e) =>
                          setPendingSelections((prev) => ({
                            ...prev,
                            [item.sourceProductName]: Number(e.target.value),
                          }))
                        }
                        className="rounded-lg border border-gray-200 bg-white text-sm text-gray-800 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select product…</option>
                        {bankProducts.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={!pendingSelections[item.sourceProductName]}
                        onClick={() => handleSave(item.sourceProductName)}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Existing mappings */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Existing Mappings
          <span className="ml-1 rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5">
            {mappings.length}
          </span>
        </h3>
        {mappings.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl">
            No mapped products yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Source Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Mapped To</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m, i) => (
                  <tr key={m.id} className={`border-b border-gray-100 ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{m.sourceProductName}</td>
                    <td className="px-4 py-2.5 text-gray-700">{m.productTitle}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          dispatch(removeProductMapping({ id: m.id, sourceProductName: m.sourceProductName }))
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
    </div>
  );
}
