import { redirect } from 'next/navigation';

// Root page: redirect to /dashboard (the layout will handle auth check)
export default function RootPage() {
  redirect('/dashboard');
}
