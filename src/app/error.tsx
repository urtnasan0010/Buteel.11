"use client";
import {t} from '@/shared/translations';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="content page">
      <h1><span lang="mn">{t('mn','load_error')}</span> / <span lang="en">{t('en','load_error')}</span></h1>
      <p><span lang="mn">{t('mn','please_retry')}</span> / <span lang="en">{t('en','please_retry')}</span></p>
      <button onClick={reset}><span lang="mn">{t('mn','retry')}</span> / <span lang="en">{t('en','retry')}</span></button>
    </main>
  );
}
