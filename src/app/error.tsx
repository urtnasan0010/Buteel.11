"use client";
import {t} from '@/shared/translations';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="content page">
      <h1>{t('mn','load_error')}</h1>
      <p>{t('mn','please_retry')}</p>
      <button onClick={reset}>{t('mn','retry')}</button>
      <a className="text-link" href="/rights#right-complaints">Гомдол, хууль зүйн туслалцаа</a>
    </main>
  );
}
