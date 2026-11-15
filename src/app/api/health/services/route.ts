import { checkNeonServices } from '@/server/neon-services';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Share in-flight probes and reuse their result for 30 seconds per process.
// Keep HTTP responses uncached so callers receive the current probe status.
let probe: ReturnType<typeof checkNeonServices> | undefined;
let expiresAt = 0;

export async function GET() {
  if (!probe || Date.now() >= expiresAt) {
    probe = checkNeonServices();
    expiresAt = Date.now() + 30000;
  }
  const services = await probe;
  return Response.json(services, {
    status: services.postgres && services.objectStorage ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
