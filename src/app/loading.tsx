import {t} from '@/shared/translations';
export default function Loading() {
  return (
    <main id="main" className="content page" aria-busy="true">
      <p role="status"><span lang="mn">{t('mn','loading')}</span> / <span lang="en">{t('en','loading')}</span></p>
    </main>
  );
}
