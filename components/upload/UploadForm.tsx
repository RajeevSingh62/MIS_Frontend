'use client';

import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { uploadFile } from '@/features/upload/upload.thunk';
import { selectUploading } from '@/features/upload/upload.selectors';
import { selectBanks } from '@/features/reference/reference.selectors';
import Button from '@/components/ui/Button';

export default function UploadForm() {
  const dispatch = useAppDispatch();
  const uploading = useAppSelector(selectUploading);

  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const banks = useAppSelector(selectBanks);

  const selectedBank = banks.find((b) => b.id === Number(selectedBankId));

  const acceptedTypes = ['.xlsx', '.xls', '.csv'];
  const isValidFile = (f: File) =>
    acceptedTypes.some((ext) => f.name.toLowerCase().endsWith(ext));

  const handleFileSelect = (f: File) => {
    if (!isValidFile(f)) {
      setError('Only .xlsx, .xls, or .csv files are accepted.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleSubmit = () => {
    if (!selectedBank) { setError('Please select a bank.'); return; }
    if (!file) { setError('Please select a file to upload.'); return; }
    setError('');
    dispatch(uploadFile({ bankTitle: selectedBank.bank_title, filename: file.name }));
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Upload Bank Leads File</h2>
        <p className="text-sm text-gray-500 mt-0.5">Select a bank and upload an Excel or CSV file with lead data.</p>
      </div>

      {/* Bank selector */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="upload-bank" className="text-sm font-medium text-gray-700">
          Bank <span className="text-red-500">*</span>
        </label>
        <select
          id="upload-bank"
          value={selectedBankId}
          onChange={(e) => setSelectedBankId(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white text-sm text-gray-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-xs"
          disabled={uploading}
        >
          <option value="">Select bank…</option>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>{b.bank_title}</option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : file
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
          }}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-800">{file.name}</p>
            <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">
              {dragOver ? 'Drop your file here' : 'Drag & drop or click to select'}
            </p>
            <p className="text-xs">Accepted: .xlsx, .xls, .csv</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Upload button */}
      <div className="flex justify-end">
        <Button
          id="upload-submit-btn"
          size="md"
          loading={uploading}
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? 'Processing…' : 'Upload File'}
        </Button>
      </div>
    </div>
  );
}
