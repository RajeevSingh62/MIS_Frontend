'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectBanks, selectLeadStatuses, selectProducts } from '@/features/reference/reference.selectors';
import { selectConfig, selectSelectedBankId } from '@/features/config/config.selectors';
import { addOrUpdateStatusRule } from '@/features/config/config.thunk';
import Button from '@/components/ui/Button';

interface MapStatusModalProps {
  externalStatus: string;
  externalRemark: string | null;
  bankId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MapStatusModal({ externalStatus, externalRemark, bankId, onClose, onSuccess }: MapStatusModalProps) {
  const dispatch = useAppDispatch();
  const banks = useAppSelector(selectBanks);
  const bank = banks.find(b => b.id === bankId);
  const leadStatuses = useAppSelector(selectLeadStatuses);
  const products = useAppSelector(selectProducts).filter(p => String(p.bank_id) === String(bankId));

  const [internalStatusId, setInternalStatusId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!internalStatusId) {
      setError('Please select an internal status');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await dispatch(addOrUpdateStatusRule({
        bank_id: bankId,
        product_id: productId ? Number(productId) : null,
        external_status: externalStatus,
        external_remark: externalRemark,
        internal_status_id: Number(internalStatusId),
        is_active: true,
      })).unwrap();
      
      onSuccess();
    } catch (err: any) {
      setError(err || 'Failed to save mapping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Map Status</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <div className="text-sm">
              <span className="text-gray-500">Bank:</span>{' '}
              <span className="font-medium text-gray-900">{bank?.bank_title}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">External Status:</span>{' '}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-indigo-700">
                {externalStatus}
              </span>
            </div>
            {externalRemark && (
              <div className="text-sm">
                <span className="text-gray-500">External Remark:</span>{' '}
                <span className="font-medium text-gray-900">{externalRemark}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Map to Internal Status <span className="text-red-500">*</span>
            </label>
            <select
              value={internalStatusId}
              onChange={(e) => setInternalStatusId(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select internal status...</option>
              {leadStatuses.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Specific to Product (Optional)
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Apply to all products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500">If selected, this mapping will only apply to this product.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} loading={loading}>Save Mapping</Button>
        </div>
      </div>
    </div>
  );
}
