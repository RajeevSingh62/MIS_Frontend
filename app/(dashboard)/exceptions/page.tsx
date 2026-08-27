import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exception Queue | BankSathi MIS',
};

export default function ExceptionsPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-gray-900">Exception Queue</h1>
      <p className="text-gray-500">Resolve unmapped statuses and products — <span className="text-indigo-600 font-medium">coming soon</span>.</p>
    </div>
  );
}
