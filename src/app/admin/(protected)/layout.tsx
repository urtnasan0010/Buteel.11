import { redirect } from 'next/navigation';
import { currentAdmin } from '@/server/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login/reset live outside this route group. Never infer access from a cached
  // layout's request pathname during client-side navigation.
  let actor = null;
  try { actor = await currentAdmin(); } catch { /* Never expose content on auth failure. */ }
  if (!actor) redirect('/admin/login?lang=mn');
  return children;
}
