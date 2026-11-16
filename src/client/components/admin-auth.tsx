'use client';
import { useState } from 'react';
import { createAuthClient } from '@neon/auth/next';
import { n } from '@/shared/nationwide';
import type { Lang } from '@/shared/data';
import { useRouter } from 'next/navigation';
const authClient = createAuthClient();

export function AdminLogin({ lang }: { lang: Lang }) {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  if (resetEmail) return <><p role="status">{n(lang,'resetCodeHint')}</p><ResetPassword lang={lang} token="" email={resetEmail} /><button className="secondary" onClick={() => { setResetEmail(''); setMessage(''); }}>{n(lang,'cancel')}</button></>;
  return <form className="admin-login" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setMessage(''); const data = new FormData(e.currentTarget);
    try {
      const result = await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) });
      if (result.error) throw new Error('Invalid');
      // A fresh document reads the new session cookie and discards stale auth layouts.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/admin?lang=mn');
    }
    catch { setMessage(n(lang, 'failed')); setBusy(false); }
  }}><label>{n(lang, 'email')}<input type="email" name="email" autoComplete="username" required /></label><label>{n(lang, 'password')}<input type="password" name="password" autoComplete="current-password" required /></label><button disabled={busy}>{n(lang, 'login')}</button>
  <button type="button" className="secondary" disabled={busy} onClick={async event => {
    const email = event.currentTarget.form?.querySelector<HTMLInputElement>('input[name="email"]');
    if (!email?.reportValidity()) return;
    const requestedEmail = email.value.trim();
    setBusy(true);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email: requestedEmail, type: 'forget-password' });
      if (result.error) throw new Error('Reset unavailable');
      setResetEmail(requestedEmail);
    } catch { setMessage(n(lang, 'resetFailed')); } finally { setBusy(false); }
  }}>{n(lang,'resetPassword')}</button><p role="alert">{message}</p></form>;
}
export function ResetPassword({lang,token,email=''}:{lang:Lang;token:string;email?:string}) {
  const router=useRouter();const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  return <form className="admin-login" onSubmit={async e=>{
    e.preventDefault();setBusy(true);setMessage('');
    try {
      const d=new FormData(e.currentTarget);const password=String(d.get('password'));
      const result=token ? await authClient.resetPassword({token,newPassword:password}) : await authClient.emailOtp.resetPassword({email:String(d.get('email')).trim(),otp:String(d.get('otp')).trim(),password});
      if(result.error)throw new Error('Invalid');router.push(`/admin/login?lang=${lang}`);router.refresh();
    }catch{setMessage(n(lang,'failed'));setBusy(false);}
  }}>
    {!token && <><label>{n(lang,'email')}<input type="email" name="email" autoComplete="username" defaultValue={email} required/></label><label>{n(lang,'resetCode')}<input name="otp" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6,8}" maxLength={8} required/></label></>}
    <label>{n(lang,'password')}<input type="password" name="password" minLength={12} maxLength={128} autoComplete="new-password" aria-describedby="password-hint" required/></label><p id="password-hint">{n(lang,'passwordHint')}</p><button disabled={busy}>{n(lang,'save')}</button><p role="alert">{message}</p></form>;
}
