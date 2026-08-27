import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/components/providers/ReduxProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BankSathi MIS | Partner Bank Lead Dashboard',
  description:
    'Internal MIS Dashboard for tracking partner bank leads — loans, credit cards, and savings accounts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full font-sans antialiased bg-gray-50 text-gray-900">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
