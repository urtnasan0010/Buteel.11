export type Lang = "mn" | "en";
export type Text = Record<Lang, string>;
export const features = ["stepFree", "lift", "toilet", "text", "sign"] as const;
export type Feature = (typeof features)[number];
export {categories,districts,districtEnglish,featureLabels} from "./translations";
import {categories,districts,districtEnglish} from "./translations";
export type SourcedField =
  | "name"
  | "description"
  | "audience"
  | "district"
  | "address"
  | "hours"
  | "phone"
  | "email";
export interface SourceRecord {
  url: string;
  title: Text;
  fields: SourcedField[];
  checkedAt: string;
}
export interface Service {
  id: string;
  name: Text;
  description: Text;
  category: number;
  district: string;
  cost: "free" | "paid" | "unknown";
  access: Record<Feature, boolean | null>;
  sourceUrl: string | null;
  verificationStatus: "source-checked" | "provider-confirmed" | "unverified";
  lastChecked: string | null;
  providerConfirmedAt: string | null;
  sources: SourceRecord[];
  address: Text | null;
  hours: Text | null;
  phone: string | null;
  email: string | null;
  audience: Text;
  documents: Text[];
  steps: Text[];
}
export { services } from "./listings";
export interface Filters {
  q?: string;
  category?: string;
  district?: string;
  cost?: string;
  access?: string[];
}
export function filterServices(items: Service[], f: Filters): Service[] {
  const q = (f.q || "").trim().toLocaleLowerCase();
  return items.filter(
    (s) =>
      (!q ||
        [
          s.name.mn,
          s.name.en,
          s.description.mn,
          s.description.en,
          categories[s.category].mn,
          categories[s.category].en,
          s.district,
          districtEnglish[districts.indexOf(s.district)],
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(q)) &&
      (!f.category || String(s.category) === f.category) &&
      (!f.district || s.district === f.district) &&
      (!f.cost || s.cost === f.cost) &&
      (f.access || []).every(
        (a) =>
          features.includes(a as Feature) && s.access[a as Feature] === true,
      ),
  );
}
