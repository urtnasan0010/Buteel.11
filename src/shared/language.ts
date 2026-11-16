import type { Lang } from './data';

export function selectLanguage(value: string | string[] | null | undefined): Lang {
  // Keep old URLs working, but serve the Mongolian-only interface for every query.
  void value;
  return 'mn';
}
