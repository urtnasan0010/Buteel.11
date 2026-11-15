import { getAuth, sameOrigin } from '@/server/auth';

// No signup, social account creation, user-management or role APIs are proxied.
const allowed = new Set(['sign-in/email', 'sign-out', 'get-session', 'request-password-reset', 'reset-password', 'email-otp/send-verification-otp', 'email-otp/reset-password']);
type Context = { params: Promise<{ path: string[] }> };
async function handle(request: Request, context: Context) {
  const path = (await context.params).path.join('/');
  if (!allowed.has(path)) return Response.json({ error: 'Not found' }, { status: 404 });
  if (request.method !== 'GET' && !sameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const handlers = getAuth().handler();
  if (request.method === 'GET') return handlers.GET(request, context);
  return handlers.POST(request, context);
}
export const GET = handle;
export const POST = handle;
