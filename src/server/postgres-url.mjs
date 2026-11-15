/** @param {string | undefined} value */
export function postgresUrl(value) {
  if (!value) throw new Error('Database connection is not configured');
  const url = new URL(value);
  // Preserve pg's current certificate and hostname verification explicitly.
  url.searchParams.delete('uselibpqcompat');
  url.searchParams.set('sslmode', 'verify-full');
  return url.toString();
}
