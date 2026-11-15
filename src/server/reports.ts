import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
function sign(value: string) {
  if (!process.env.REPORT_SECRET) throw new Error('REPORT_SECRET is not configured');
  return createHmac('sha256', process.env.REPORT_SECRET).update(value).digest('hex');
}
export function reportChallenge() {
  const value = `${Date.now()}.${randomBytes(24).toString('hex')}`;
  return `${value}.${sign(value)}`;
}
export function verifyChallenge(token: string) {
  const match = /^(\d{13})\.([a-f0-9]{48})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return null;
  const elapsed = Date.now() - Number(match[1]);
  if (elapsed < 2000 || elapsed > 3600000) return null;
  const signature = sign(`${match[1]}.${match[2]}`);
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(match[3], 'hex')) ? match[2] : null;
}
export function rateKey(session: string) { return sign(session); }
