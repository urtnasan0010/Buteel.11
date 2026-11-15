import type { Lang } from './data';
import { regions, type Item } from './nationwide';

// Editorial placeholders remain available to admins, never to public readers.
export function publicText(value: string | null | undefined): string {
  return value && !/TODO\s*\[/i.test(value) ? value.trim() : '';
}

// These exact hosts returned successful HTTPS responses during this review.
const secureInsuranceHosts = new Set([
  'baganuur.ndaatgal.mn','bagahangai.ndaatgal.mn','bayangol.ndaatgal.mn',
  'bayanzurh.ndaatgal.mn','nalaih.ndaatgal.mn','songinohairhan.ndaatgal.mn',
  'suhbaatar-duureg.ndaatgal.mn','han-uul.ndaatgal.mn','chingeltei.ndaatgal.mn',
]);
export function publicUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.username || url.password || !['http:','https:'].includes(url.protocol)) return '';
    if (url.protocol === 'http:' && secureInsuranceHosts.has(url.hostname) && url.pathname === '/' && !url.search && !url.hash) url.protocol = 'https:';
    return url.toString();
  } catch { return ''; }
}

export function publicBody(value: string): string {
  return publicText(value)
    .replace('шаардлагатай гэж судалгаанд тэмдэглэсэн.', 'шаардлагыг доорх журмын эх сурвалжаас шалгана.')
    .replace('ажиллуулах үүрэгтэй гэж судалгаанд тэмдэглэсэн.', 'ажиллуулах үүргийг Хөдөлмөрийн тухай хуулийн 144.2 дахь заалтад тусгасан.')
    .replace('The research lists', 'The linked procedure lists')
    .replace('The research identifies Labour Law Article 144.2 as requiring employers', 'Labour Law Article 144.2 requires employers')
    .replace(/ишилсэн\s*/gu, '')
    .replace(/\bcited\s+/gi, 'linked ');
}

export function sortByRegionName(items: Item[], lang: Lang): Item[] {
  const compare = new Intl.Collator(lang);
  const regionName = (item: Item) => regions.find(region => region.id === item.region)?.name[lang] ?? '';
  return [...items].sort((a,b) => compare.compare(regionName(a),regionName(b)) || compare.compare(a.title[lang],b.title[lang]) || a.id.localeCompare(b.id));
}
