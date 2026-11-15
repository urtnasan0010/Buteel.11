import { selectLanguage } from '@/shared/language';
const text = {
  title: { mn: 'Нууцлал', en: 'Privacy' },
  browsing: { mn: 'Зочин бүртгэл үүсгэхгүйгээр мэдээлэл үзнэ. Хайлтын үг, шүүлтүүр холбоос дотор хадгалагддаг тул эмзэг хувийн мэдээлэл бүү бичээрэй.', en: 'Visitors browse without an account. Search terms and filters appear in URLs; do not include sensitive personal information.' },
  reports: { mn: 'Асуудлын маягтаар илгээсэн мэдээлэл өгөгдлийн санд хадгалагдаж, зөвхөн админ үзнэ. Спамаас хамгаалахад нэг цагийн хугацаатай, зөвхөн серверт уншигдах cookie ашиглана. Онош, регистрийн дугаар бүү илгээгээрэй.', en: 'Submitted reports are stored in the database and visible only to admins. Spam prevention uses a one-hour HTTP-only cookie. Do not submit diagnoses or identity numbers.' },
  admin: { mn: 'Админы нэвтрэлтэд Neon Auth-ийн хамгаалалттай session cookie ашиглана. Зочдод нийтийн бүртгэл байхгүй.', en: 'Admin login uses Neon Auth session cookies. There is no public registration.' },
  checklists: { mn: 'Бэлтгэлийн жагсаалтын тэмдэглэгээ тухайн хуудас нээлттэй байх хугацаанд л хадгалагдана. Хэвлэж авч болно.', en: 'Checklist selections last while the page remains open. You can print them.' },
};
export default async function Privacy({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) { const lang=selectLanguage((await searchParams).lang); return <main id="main" className="content page reading"><h1>{text.title[lang]}</h1><p>{text.browsing[lang]}</p><p>{text.reports[lang]}</p><p>{text.admin[lang]}</p><p>{text.checklists[lang]}</p></main>; }
