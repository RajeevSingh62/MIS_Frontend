import { redirect } from 'next/navigation';

// Root page: redirect to /upload (the layout will handle auth check)
export default function RootPage() {
  redirect('/upload');
}
