'use client';
/* eslint-disable @next/next/no-img-element -- Upload previews use local object URLs. */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/shared/data';
import { MAX_IMAGE_BYTES, MAX_POST_BYTES, MAX_POST_IMAGES, pc, postDate, postInputSchema, postTypes, todayInMongolia, type Post, type PostPage } from '@/shared/posts';
import PostArticle from './post-article';
import { useUnsavedChanges } from './use-unsaved-changes';
import { clearPostDraft, readPostDraft, rememberPostDraft } from './post-draft';

function emptyPost(): Post {
  return { id:crypto.randomUUID(),version:0,title:{ mn:'',en:'' },body:{ mn:'',en:'' },type:'announcement',
    postedDate:todayInMongolia(),startDate:'',endDate:'',publishState:'draft',images:[] };
}
async function responseData(response: Response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'failed');
  return result;
}
function messageFor(error: unknown, lang: Lang) {
  const key = error instanceof Error ? error.message : '';
  return pc(lang,key === 'conflict' || key === 'denied' || key === 'setup' || key === 'fileError' ? key : 'failed');
}
export default function PostAdmin({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [recovery] = useState(readPostDraft);
  const [data,setData] = useState<PostPage>({ posts:[],page:1,hasMore:false });
  const [editor,setEditor] = useState<Post | null>(recovery?.post ?? null);
  const [baseline,setBaseline] = useState(recovery?.baseline ?? '');
  const [preview,setPreview] = useState(false);
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const [loadFailed,setLoadFailed] = useState(false);
  const [message,setMessage] = useState(recovery ? pc(lang,'draftRestored') : '');
  const files = useRef(new Map<string,File>(recovery?.files));
  const urls = useRef(new Map<string,string>(recovery?.post.images.filter(image => recovery.files.has(image.id)).map(image => [image.id, image.url])));
  const titleInput = useRef<HTMLTextAreaElement>(null);
  const newButton = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  function releaseImages() { urls.current.forEach(url => URL.revokeObjectURL(url)); urls.current.clear(); files.current.clear(); }
  useEffect(() => {
    const currentUrls = urls.current;
    return () => { if (!readPostDraft()) currentUrls.forEach(url => URL.revokeObjectURL(url)); };
  },[]);
  const dirty = Boolean(editor && JSON.stringify(editor) !== baseline);
  useUnsavedChanges(dirty,busy,pc(lang,'discardConfirm'));
  useEffect(() => { rememberPostDraft(editor, baseline, files.current); }, [editor, baseline]);
  useEffect(() => {
    window.addEventListener('staff-discard-draft', clearPostDraft);
    return () => window.removeEventListener('staff-discard-draft', clearPostDraft);
  }, []);
  const activeId = editor?.id;
  useEffect(() => { if (activeId) titleInput.current?.focus(); },[activeId]);
  async function load(page: number) {
    setLoading(true); setLoadFailed(false);
    try { setData(await responseData(await fetch(`/api/admin/posts?page=${page}`,{ cache:'no-store' }))); }
    catch (error) { setLoadFailed(true); setMessage(messageFor(error,lang)); throw error; }
    finally { setLoading(false); }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/posts',{ cache:'no-store',signal:controller.signal }).then(responseData).then(setData).catch(error => {
      if (!controller.signal.aborted) { setLoadFailed(true); setMessage(messageFor(error,lang)); }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  },[lang]);
  function closeEditor() { clearPostDraft(); releaseImages(); setEditor(null); setPreview(false); newButton.current?.focus(); }
  function openEditor(post: Post) { releaseImages(); setBaseline(JSON.stringify(post)); setEditor(post); setPreview(false); setMessage(''); }
  function cancelEditor() { if (!dirty || window.confirm(pc(lang,'discardConfirm'))) closeEditor(); }
  async function save(state: Post['publishState']) {
    if (!editor || busyRef.current) return;
    const { images,...fields } = editor;
    const input = { ...fields,publishState:state,images:images.map(({ id,alt }) => ({ id,alt })) };
    if (!postInputSchema.safeParse(input).success) { setMessage(state === 'published' ? pc(lang,'publishHint') : pc(lang,'failed')); return; }
    if ([...files.current.values()].reduce((sum,file) => sum + file.size,0) + JSON.stringify(input).length * 3 + 100000 > MAX_POST_BYTES) { setMessage(pc(lang,'fileError')); return; }
    busyRef.current = true; setBusy(true); setMessage('');
    const form = new FormData(); form.set('post',JSON.stringify(input)); files.current.forEach((file,id) => form.append(`image:${id}`,file));
    try {
      await responseData(await fetch('/api/admin/posts',{ method:'POST',body:form }));
      closeEditor(); router.refresh(); setMessage(pc(lang,'saved'));
      try { await load(1); } catch { setMessage(pc(lang,'savedRefresh')); }
    } catch (error) { setMessage(messageFor(error,lang)); }
    finally { busyRef.current = false; setBusy(false); }
  }
  async function remove(post: Post) {
    if (busyRef.current || !window.confirm(pc(lang,'removeConfirm'))) return;
    busyRef.current = true; setBusy(true); setMessage('');
    try {
      await responseData(await fetch('/api/admin/posts',{ method:'DELETE',headers:{ 'Content-Type':'application/json' },body:JSON.stringify({ id:post.id,version:post.version }) }));
      setMessage(pc(lang,'deleted')); router.refresh();
      try { await load(data.posts.length === 1 ? Math.max(1,data.page - 1) : data.page); } catch { setMessage(pc(lang,'savedRefresh')); }
      newButton.current?.focus();
    } catch (error) { setMessage(messageFor(error,lang)); }
    finally { busyRef.current = false; setBusy(false); }
  }
  function addFiles(selected: FileList | null) {
    if (!editor || !selected) return;
    const incoming = Array.from(selected);
    const totalBytes = [...files.current.values(),...incoming].reduce((sum,file) => sum + file.size,0);
    if (editor.images.length + incoming.length > MAX_POST_IMAGES || totalBytes > MAX_POST_BYTES - 200000 || incoming.some(file => !['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || !file.size || file.size > MAX_IMAGE_BYTES)) { setMessage(pc(lang,'fileError')); return; }
    const additions = incoming.map(file => { const id = crypto.randomUUID(); const url = URL.createObjectURL(file); files.current.set(id,file); urls.current.set(id,url); return { id,url,alt:{ mn:'',en:'' } }; });
    setEditor({ ...editor,images:[...editor.images,...additions] }); setMessage('');
  }
  return <>
    <p className="note">{pc(lang,'homeOnly')}</p>
    <div className="admin-toolbar"><button ref={newButton} disabled={busy || Boolean(editor)} onClick={() => openEditor(emptyPost())}>{pc(lang,'create')}</button></div>
    <p role="status" aria-live="polite" className="post-status">{message}</p>
    {editor && <form className="post-editor" onSubmit={event => { event.preventDefault(); void save(editor.publishState); }}>
      <fieldset disabled={busy} className="post-fields"><legend>{editor.version ? pc(lang,'edit') : pc(lang,'create')}</legend>
        <p className="meta">{pc(lang,'publishHint')}</p>
        {(['title','body'] as const).map(field => <label key={field}>{pc(lang,field)}<textarea ref={field === 'title' ? titleInput : undefined} lang="mn" value={editor[field].mn} rows={field === 'title' ? 2 : 7} maxLength={field === 'title' ? 240 : 20000} onChange={event => setEditor({ ...editor,[field]:{ ...editor[field],mn:event.target.value } })}/></label>)}
        <div className="post-date-fields"><label>{pc(lang,'type')}<select value={editor.type} onChange={event => setEditor({ ...editor,type:event.target.value as Post['type'] })}>{postTypes.map(type => <option key={type} value={type}>{pc(lang,type)}</option>)}</select></label>
          <label>{pc(lang,'postedDate')}<input type="date" required value={editor.postedDate} onChange={event => setEditor({ ...editor,postedDate:event.target.value })}/></label></div>
        <label>{pc(lang,'images')}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple aria-describedby="post-upload-hint" onChange={event => { addFiles(event.target.files); event.target.value = ''; }}/></label><p id="post-upload-hint" className="meta">{pc(lang,'uploadHint')}</p>
        <div className="post-image-editor">{editor.images.map((image,index) => <fieldset key={image.id}><legend>{pc(lang,'images')} {index + 1}</legend><img src={image.url} alt={image.alt[lang]} width={160} height={120}/><label>{pc(lang,'alt')}<textarea rows={2} lang="mn" maxLength={500} value={image.alt.mn} onChange={event => setEditor({ ...editor,images:editor.images.map(item => item.id === image.id ? { ...item,alt:{ ...item.alt,mn:event.target.value } } : item) })}/></label><button type="button" className="secondary" onClick={() => { const url = urls.current.get(image.id); if (url) URL.revokeObjectURL(url); urls.current.delete(image.id); files.current.delete(image.id); setEditor({ ...editor,images:editor.images.filter(item => item.id !== image.id) }); }}>{pc(lang,'removeImage')}</button></fieldset>)}</div>
        <div className="admin-actions"><button type="submit">{busy ? pc(lang,'saving') : editor.publishState === 'published' ? pc(lang,'savePublished') : pc(lang,'saveDraft')}</button>
          {editor.publishState === 'draft' ? <button type="button" onClick={() => void save('published')}>{pc(lang,'publish')}</button> : <button type="button" className="secondary" onClick={() => void save('draft')}>{pc(lang,'unpublish')}</button>}
          <button type="button" className="secondary" aria-expanded={preview} onClick={() => setPreview(!preview)}>{pc(lang,'preview')}</button><button type="button" className="secondary" onClick={cancelEditor}>{pc(lang,'cancel')}</button></div>
      </fieldset>
      {preview && <section className="post-preview" aria-label={pc(lang,'preview')}><h2>{pc(lang,'preview')}</h2><PostArticle post={editor} lang={lang} expanded/></section>}
    </form>}
    <section aria-label={pc(lang,'manage')} aria-busy={loading}>
      {loading ? <p role="status">{pc(lang,'loading')}</p> : loadFailed ? <button className="secondary" disabled={busy} onClick={() => void load(data.page).catch(() => {})}>{pc(lang,'retry')}</button> : !data.posts.length ? <p>{pc(lang,'empty')}</p> : data.posts.map(post => <article className="admin-row" key={post.id}><div><h2>{post.title.mn || pc(lang,'draft')}</h2><p>{pc(lang,post.publishState)} · {pc(lang,post.type)} · <time dateTime={post.postedDate}>{postDate(post.postedDate,lang)}</time></p></div><div className="admin-actions"><button className="secondary" disabled={busy || Boolean(editor)} onClick={() => openEditor(post)}>{pc(lang,'edit')}</button><button className="secondary" disabled={busy || Boolean(editor)} onClick={() => void remove(post)}>{pc(lang,'remove')}</button></div></article>)}
      {!loadFailed && <nav className="post-pagination" aria-label={lang === 'mn' ? 'Нийтлэлийн хуудас' : 'Post pages'}>{data.page > 1 && <button className="secondary" disabled={loading || busy || Boolean(editor)} onClick={() => void load(data.page - 1).catch(() => {})}>{pc(lang,'previous')}</button>}{data.hasMore && <button className="secondary" disabled={loading || busy || Boolean(editor)} onClick={() => void load(data.page + 1).catch(() => {})}>{pc(lang,'next')}</button>}</nav>}
    </section>
  </>;
}
