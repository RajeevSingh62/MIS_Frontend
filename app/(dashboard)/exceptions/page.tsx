import type { Metadata } from 'next';
import ExceptionsClient from './ExceptionsClient';

export const metadata: Metadata = {
  title: 'Exception Queue | BankSathi MIS',
};

export default function ExceptionsPage() {
  return <ExceptionsClient />;
}
