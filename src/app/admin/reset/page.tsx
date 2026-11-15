import { ResetPassword } from '@/client/components/admin-console';
import { selectLanguage } from '@/shared/language';
import { n } from '@/shared/nationwide';
export default async function Reset({searchParams}:{searchParams:Promise<{lang?:string|string[];token?:string|string[]}>}) {
  const p=await searchParams;const lang=selectLanguage(p.lang);const token=typeof p.token==='string'?p.token:'';
  return <main id="main" className="content page reading"><h1>{n(lang,'resetPassword')}</h1><ResetPassword lang={lang} token={token}/></main>;
}
