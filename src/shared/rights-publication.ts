import type { Verification } from './rights';

export type PublicationApproval = {
  publishUnverified: boolean;
  approvedBy: string;
  approvedAt: string | null;
  reason: string;
};
// Source-controlled administrator setting. A deliberate publication requires all
// audit fields; changing it never changes verification status or review dates.
// Keep overrides off until the site owner explicitly approves an individual item.
export const rightsPublication: Record<string, PublicationApproval> = {
  'contact:legal-aid': { publishUnverified: false, approvedBy: '', approvedAt: null, reason: '' },
};

export function mayPublish(verification: Verification, approval?: PublicationApproval) {
  if (verification === 'VERIFIED') return true;
  return Boolean(approval?.publishUnverified && approval.approvedBy.trim() && approval.reason.trim()
    && approval.approvedAt && /^\d{4}-\d{2}-\d{2}$/.test(approval.approvedAt) && Number.isFinite(Date.parse(approval.approvedAt)));
}
