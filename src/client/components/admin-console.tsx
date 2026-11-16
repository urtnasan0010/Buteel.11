'use client';
import { useEffect, useState } from 'react';
import { createAuthClient } from '@neon/auth/next';
import { emptyItem, n, regions, type Item, type ItemInput, type Kind } from '@/shared/nationwide';
import type { Lang } from '@/shared/data';
import { useRouter } from 'next/navigation';
import DisabilityCategoryEditor from './disability-category-editor';
const authClient = createAuthClient();

export function AdminLogin({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  if (resetEmail) return <><p role="status">{n(lang,'resetCodeHint')}</p><ResetPassword lang={lang} token="" email={resetEmail} /><button className="secondary" onClick={() => { setResetEmail(''); setMessage(''); }}>{n(lang,'cancel')}</button></>;
  return <form className="admin-login" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setMessage(''); const data = new FormData(e.currentTarget);
    try { const result = await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) }); if (result.error) throw new Error('Invalid'); router.push(`/admin?lang=${lang}`); router.refresh(); }
    catch { setMessage(n(lang, 'failed')); setBusy(false); }
  }}><label>{n(lang, 'email')}<input type="email" name="email" autoComplete="username" required /></label><label>{n(lang, 'password')}<input type="password" name="password" autoComplete="current-password" required /></label><button disabled={busy}>{n(lang, 'login')}</button>
  <button type="button" className="secondary" disabled={busy} onClick={async event => {
    const email = event.currentTarget.form?.querySelector<HTMLInputElement>('input[name="email"]');
    if (!email?.reportValidity()) return;
    setBusy(true);
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email: email.value.trim(), type: 'forget-password' });
      if (result.error) throw new Error('Reset unavailable');
      setResetEmail(email.value.trim());
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
type Report = { id: string; message: { mn: string; en: string }; page: { mn: string; en: string }; language: Lang; resolved: boolean; created_at: string };
export function AdminConsole({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind | 'reports'>('organisations'); const [items, setItems] = useState<Item[]>([]); const [reports, setReports] = useState<Report[]>([]);
  const [editing, setEditing] = useState<ItemInput | null>(null); const [id, setId] = useState<string | undefined>(); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const [research, setResearch] = useState<{ id: string; kind: Kind; data: Record<string, unknown> } | null>(null);
  const activeId = editing ? id : undefined;
  useEffect(() => {
    if (!activeId || kind === 'reports') return;
    let active = true;
    fetch(`/api/admin/${kind}?id=${encodeURIComponent(activeId)}`, { cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Denied');
      const result = await response.json();
      if (active && result.research) setResearch({ id: activeId, kind, data: result.research });
    }).catch(() => { if (active) setMessage(n(lang,'unavailable')); });
    return () => { active = false; };
  }, [activeId,kind,lang]);
  async function load(selected: Kind | 'reports') {
    const result = await fetch(`/api/admin/${selected}`, { cache: 'no-store' }); if (!result.ok) throw new Error('Denied');
    const data = await result.json(); if (selected === 'reports') setReports(data); else setItems(data);
  }
  useEffect(() => { let active = true; fetch(`/api/admin/${kind}`, { cache: 'no-store' }).then(async r => { if (!r.ok) throw new Error('Denied'); const data = await r.json(); if (active) { if (kind === 'reports') setReports(data); else setItems(data); } }).catch(() => { if (active) setMessage(n(lang, 'failed')); }); return () => { active = false; }; }, [kind, lang]);
  async function write(method: string, data: unknown) {
    const r = await fetch(`/api/admin/${kind}`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error('Rejected'); await load(kind);
  }
  const textFields = ['title','body','localArea','lawName','article','revision','checklist','contact'] as const;
  const labels = { title: 'title', body: 'body', localArea: 'area', lawName: 'law', article: 'article', revision: 'revised', checklist: 'checklist', contact: 'contact' } as const;
  return <>
    <div className="admin-toolbar"><label>{n(lang, 'admin')}<select value={kind} onChange={e => { setKind(e.target.value as Kind | 'reports'); setEditing(null); setMessage(''); }}>{(['organisations','guides','rights','reports'] as const).map(k => <option value={k} key={k}>{n(lang, k)}</option>)}</select></label>
      <button className="secondary" onClick={async () => { await authClient.signOut(); router.push(`/admin/login?lang=${lang}`); router.refresh(); }}>{n(lang, 'signOut')}</button></div>
    <p role="status">{message}</p>
    {kind === 'reports' ? <div>{reports.map(report => <article className="published-item" key={report.id}><p className="preserve-lines">{report.message[report.language]}</p><p>{report.page[lang]}</p><time>{new Date(report.created_at).toISOString().slice(0,10)}</time>{report.resolved ? <p>{n(lang, 'resolved')}</p> : <button disabled={busy} onClick={async () => { setBusy(true); try { await write('POST', { id: report.id }); } catch { setMessage(n(lang, 'failed')); } finally { setBusy(false); } }}>{n(lang, 'resolve')}</button>}</article>)}</div> : <>
      {!editing && <button onClick={() => { setId(undefined); setEditing(emptyItem()); }}>{n(lang, 'create')}</button>}
      {editing ? <form className="admin-editor" onSubmit={async e => { e.preventDefault(); setBusy(true); setMessage(''); try { await write('POST', { id, item: editing }); setEditing(null); } catch { setMessage(n(lang, 'failed') + ' ' + n(lang, 'publicationRule')); } finally { setBusy(false); } }}>
        <p className="note">{n(lang, 'publicationRule')}</p>
        {editing.disabilityCategory&&<DisabilityCategoryEditor lang={lang} value={editing.disabilityCategory} onChange={category=>setEditing({...editing,disabilityCategory:category,body:{mn:category.facts.map(fact=>fact.text.mn).filter(Boolean).join('\n\n'),en:category.facts.map(fact=>fact.text.en).filter(Boolean).join('\n\n')}})}/>}
        {kind==='organisations'&&<label>{n(lang,'confidence')}<select value={editing.confidence??''} onChange={event=>setEditing({...editing,confidence:(event.target.value||null) as ItemInput['confidence']})}><option value="">{n(lang,'unknown')}</option>{(['high','medium','low'] as const).map(value=><option key={value} value={value}>{n(lang,value)}</option>)}</select></label>}
        {research && research.id===id && research.kind===kind && <details className="topic-details"><summary>{n(lang,'researchRecord')}</summary><p>{n(lang,'researchReview')}</p><pre className="research-record">{JSON.stringify(research.data,null,2)}</pre></details>}
        {textFields.filter(field=>!editing.disabilityCategory||field==='title').filter(field => kind === 'rights' || !['lawName','article','revision','contact'].includes(field)).filter(field => kind === 'guides' || field !== 'checklist').map(field => <fieldset key={field}><legend>{n(lang, labels[field])}</legend><div className="bilingual-fields">{(['mn','en'] as const).map(language => <label key={language}>{language === 'mn' ? 'Монгол' : 'English'}<textarea lang={language} rows={field === 'body' || field === 'checklist' ? 5 : 2} maxLength={12000} required={field === 'title' || field === 'body'} value={editing[field][language]} onChange={e => setEditing({ ...editing, [field]: { ...editing[field], [language]: e.target.value } })} /></label>)}</div></fieldset>)}
        {kind === 'organisations' && <><label>{n(lang, 'region')}<select value={editing.region} onChange={e => setEditing({ ...editing, region: e.target.value })}><option value="">{n(lang, 'unknown')}</option>{regions.map(r => <option value={r.id} key={r.id}>{r.name[lang]}</option>)}</select></label><label className="check"><input type="checkbox" checked={editing.nationwide} onChange={e => setEditing({ ...editing, nationwide: e.target.checked })} />{n(lang, 'nationwide')}</label><label>{n(lang, 'remote')}<select value={editing.remote} onChange={e => setEditing({ ...editing, remote: e.target.value as ItemInput['remote'] })}>{(['unknown','yes','no'] as const).map(v => <option value={v} key={v}>{n(lang, v)}</option>)}</select></label></>}
        {(['source','website','phone','email','reviewDate'] as const).filter(field => kind === 'organisations' || ['source','reviewDate'].includes(field)).map(field => <label key={field}>{n(lang, field === 'reviewDate' ? 'review' : field)}<input type={field === 'reviewDate' ? 'date' : field === 'email' ? 'email' : field === 'source' || field === 'website' ? 'url' : 'text'} value={editing[field]} maxLength={2000} onChange={e => setEditing({ ...editing, [field]: e.target.value })} /></label>)}
        <label>{n(lang, 'status')}<select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as ItemInput['status'] })}>{(['unknown','confirmed'] as const).map(v => <option value={v} key={v}>{n(lang, v)}</option>)}</select></label>
        <label>{n(lang, 'publishState')}<select value={editing.publishState} onChange={e => setEditing({ ...editing, publishState: e.target.value as ItemInput['publishState'] })}>{(['draft','published'] as const).map(v => <option value={v} key={v}>{n(lang, v)}</option>)}</select></label>
        <div className="admin-actions"><button disabled={busy}>{n(lang, 'save')}</button><button type="button" className="secondary" onClick={() => setEditing(null)}>{n(lang, 'cancel')}</button></div>
      </form> : items.map(item => <article className="admin-row" key={item.id}><div><h2>{item.title[lang]||item.title.en||item.id}</h2><p>{n(lang, item.publishState)} · {n(lang, item.status)}</p></div><div className="admin-actions"><button className="secondary" onClick={() => {
        const { id: itemId, createdAt: _created, updatedAt: _updated, publicationInfo: _publication, ...input } = item;
        void _created; void _updated; void _publication; setId(itemId); setEditing(input);
      }}>{n(lang, 'edit')}</button><button className="secondary" disabled={busy} onClick={async () => { if (!window.confirm(n(lang, 'removeConfirm'))) return; setBusy(true); try { await write('DELETE', { id: item.id }); } catch { setMessage(n(lang, 'failed')); } finally { setBusy(false); } }}>{n(lang, 'remove')}</button></div></article>)}
    </>}
  </>;
}
