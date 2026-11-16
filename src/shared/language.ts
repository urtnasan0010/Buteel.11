import type { Lang } from './data';

export function selectLanguage(value: string | string[] | null | undefined): Lang {
  return (Array.isArray(value) ? value[0] : value) === 'en' ? 'en' : 'mn';
}
