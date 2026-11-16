import { PostsPage } from '@/server/components/posts-page';

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string | string[]; page?: string }> }) {
  return <PostsPage searchParams={searchParams} destination='warning' path='/help' />;
}
