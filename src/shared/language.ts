import type { Lang } from './data';

// Next.js supplies repeated query parameters as arrays; URLSearchParams uses
// the first value. Keep the document language and rendered page consistent.
export function selectLanguage(value: string | string[] | null | undefined): Lang {
  const first = Array.isArray(value) ? value[0] : value;
  return first === 'en' ? 'en' : 'mn';
}
