import { redirect } from 'next/navigation';
import { currentAdmin } from '@/server/auth';
import { rightsSources, rightsTopics, rightsHistory, rightsContacts } from '@/shared/rights';
import { rightsPublication } from '@/shared/rights-publication';
import { understandSources } from '@/shared/understand';

export const dynamic = 'force-dynamic';

export default async function VerificationPage() {
  let admin = null;
  try { admin = await currentAdmin(); } catch { /* Fail closed when auth is unavailable. */ }
  if (!admin) redirect('/admin/login');
  return <main id="main" className="content page reading">
    <h1>Эх сурвалжийн хяналт</h1>
    <p>Дотоод хяналтын тэмдэглэл. Нийтийн хуудсанд энэ тайланг харуулахгүй.</p>
    <p>Нийтлэх тохиргоо: src/shared/rights-publication.ts. Баталгаажаагүй зүйлийг зориуд нийтлэх бол publishUnverified, approvedBy, approvedAt, reason талбарыг тухайн зүйлээр бөглөнө. Баталгаажуулсан төлөв автоматаар өөрчлөгдөхгүй.</p>
    {Object.entries({ publication: rightsPublication, sources: rightsSources, topics: rightsTopics, history: rightsHistory, contacts: rightsContacts, understandSources }).map(([key, value]) => <section key={key}>
      <h2>{key}</h2><pre className="research-record">{JSON.stringify(value, null, 2)}</pre>
    </section>)}
  </main>;
}
