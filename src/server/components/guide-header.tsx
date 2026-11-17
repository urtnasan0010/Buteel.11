import { Noto_Serif } from 'next/font/google';

const serif = Noto_Serif({ weight: '700', subsets: ['cyrillic', 'latin'], display: 'swap', variable: '--hero-serif' });

export function GuideHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className={`home-hero guide-hero ${serif.variable}`}>
    <h1 className="home-title">{title}</h1>
    <p className="home-subtitle">{subtitle}</p>
  </header>;
}
