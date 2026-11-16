import { Noto_Serif } from 'next/font/google';
import { PostsPage } from '@/server/components/posts-page';

const heroSerif = Noto_Serif({ weight: '700', subsets: ['cyrillic', 'latin'], display: 'swap', variable: '--hero-serif' });

export default function Home({ searchParams }: { searchParams: Promise<{ lang?: string | string[]; page?: string }> }) {
  return <PostsPage searchParams={searchParams} heroClassName={heroSerif.variable} />;
}
