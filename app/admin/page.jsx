import { redirect } from 'next/navigation';
import { getAuthenticatedAdmin } from '@/lib/auth';

export default async function AdminPage() {
  const admin = await getAuthenticatedAdmin();
  if (admin) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}

