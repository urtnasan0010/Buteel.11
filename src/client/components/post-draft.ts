import type { Post } from '@/shared/posts';

// Tab-memory only: no database publication or sensitive text in browser storage.
// Files and their object URLs survive a client-side route unmount.
type Recovery = { post: Post; baseline: string; files: Map<string, File> };
let recovery: Recovery | null = null;
export function readPostDraft() { return recovery; }
export function rememberPostDraft(post: Post | null, baseline: string, files: Map<string, File>) {
  recovery = post && JSON.stringify(post) !== baseline ? { post, baseline, files: new Map(files) } : null;
}
export function clearPostDraft() {
  for (const image of recovery?.post.images ?? []) {
    if (recovery?.files.has(image.id)) URL.revokeObjectURL(image.url);
  }
  recovery = null;
}
