'use client';
import { useEffect, useState } from 'react';
import type { Lang } from '@/shared/data';
import { n } from '@/shared/nationwide';
export default function ReportForm({ lang, page = '' }: { lang: Lang; page?: string }) {
  const [token, setToken] = useState(''); const [status, setStatus] = useState(''); const [busy, setBusy] = useState(false);
  async function challenge() { const r = await fetch('/api/reports', { cache: 'no-store' }); if (!r.ok) throw new Error('Unavailable'); setToken((await r.json()).token); }
  useEffect(() => {
    let active = true;
    fetch('/api/reports', { cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json(); if (active) setToken(data.token);
    }).catch(() => { if (active) setStatus(n(lang, 'unavailable')); });
    return () => { active = false; };
  }, [lang]);
  return <section id="report-problem" className="report-form"><h2>{n(lang, 'report')}</h2><p>{n(lang, 'reportHint')}</p>
    <form onSubmit={async e => {
      e.preventDefault(); setBusy(true); setStatus(''); const form = e.currentTarget; const d = new FormData(form);
      try { const r = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang, page, token, message: d.get('message'), website: d.get('website') }) }); if (!r.ok) throw new Error(r.status === 429 ? 'limited' : 'failed'); form.reset(); setStatus(n(lang, 'sent')); }
      catch (error) { setStatus(n(lang, error instanceof Error && error.message === 'limited' ? 'wait' : 'failed')); }
      finally { await challenge().catch(() => setToken('')); setBusy(false); }
    }}><label htmlFor="public-report-message">{n(lang, 'message')}</label><textarea id="public-report-message" name="message" required minLength={5} maxLength={3000} rows={4} />
    <div className="spam-trap" aria-hidden="true"><label>{n(lang,'website')}<input name="website" tabIndex={-1} autoComplete="off" /></label></div><button disabled={busy || !token}>{n(lang, 'send')}</button></form><p role="status">{status}</p></section>;
}
