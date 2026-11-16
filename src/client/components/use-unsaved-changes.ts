'use client';
import { useEffect } from 'react';

export function useUnsavedChanges(dirty: boolean, busy: boolean, message: string) {
  useEffect(() => {
    if (!dirty && !busy) return;
    function warn(event: BeforeUnloadEvent) { event.preventDefault(); event.returnValue = ''; }
    function signOut(event: Event) { if (busy || (dirty && !window.confirm(message))) event.preventDefault(); }
    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href,location.href);
      if (!['http:','https:'].includes(destination.protocol)) return;
      if (destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search) return;
      // Run before Next's client-side Link handler can unmount the editor.
      event.preventDefault(); event.stopPropagation();
      if (busy || !window.confirm(message)) return;
      window.removeEventListener('beforeunload',warn);
      // Confirmed navigation uses a full load to avoid a second unload prompt.
      window.location.assign(destination.href);
    }
    window.addEventListener('beforeunload',warn);
    window.addEventListener('staff-sign-out-request',signOut);
    document.addEventListener('click',navigate,true);
    return () => { window.removeEventListener('beforeunload',warn); window.removeEventListener('staff-sign-out-request',signOut); document.removeEventListener('click',navigate,true); };
  },[dirty,busy,message]);
}
