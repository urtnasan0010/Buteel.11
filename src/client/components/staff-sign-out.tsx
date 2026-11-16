'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthClient } from '@neon/auth/next';

const auth = createAuthClient();
export default function StaffSignOut() {
  const router = useRouter();
  const [busy,setBusy] = useState(false);
  const [failed,setFailed] = useState(false);
  return <div className="staff-sign-out">
    <button className="secondary" disabled={busy} onClick={async () => {
      if (!window.dispatchEvent(new Event('staff-sign-out-request',{ cancelable:true }))) return;
      setBusy(true); setFailed(false);
      try {
        const result = await auth.signOut();
        if (result.error) throw new Error('Sign out failed');
        router.push('/admin/login'); router.refresh();
      } catch { setFailed(true); setBusy(false); }
    }}>{busy ? 'Гарч байна…' : 'Гарах'}</button>
    {failed && <p role="alert">Гарч чадсангүй. Дахин оролдоно уу.</p>}
  </div>;
}
