export type Lang = "mn" | "en";
export type Text = Record<Lang, string>;
export const features = ["stepFree", "lift", "toilet", "text", "sign"] as const;
export type Feature = (typeof features)[number];
export {categories,districts,districtEnglish,featureLabels} from "./translations";
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
