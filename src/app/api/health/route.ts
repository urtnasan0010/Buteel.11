import { checkNeonServices } from '@/server/neon-services';

export const dynamic = 'force-dynamic';
export async function GET() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const services = await Promise.race([
      checkNeonServices(),
      new Promise<never>((_,reject) => { timer = setTimeout(() => reject(new Error('Readiness timeout')),6000); }),
    ]);
    const ready = services.postgres && services.objectStorage;
    return Response.json({ status: ready ? 'ready' : 'unavailable' },{ status: ready ? 200 : 503, headers:{ 'Cache-Control':'no-store' } });
  } catch {
    return Response.json({ status:'unavailable' },{ status:503, headers:{ 'Cache-Control':'no-store' } });
  } finally { clearTimeout(timer); }
}
