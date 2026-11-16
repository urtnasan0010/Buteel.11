/** @param {string | undefined} value */
export function postgresUrl(value) {
  if (!value) throw new Error('Database connection is not configured');
  const url = new URL(value);
  // Preserve pg's current certificate and hostname verification explicitly.
  url.searchParams.delete('uselibpqcompat');
  // Local isolated test/dev clusters may explicitly disable TLS. Remote hosts
  // always keep certificate and hostname verification, regardless of URL flags.
  if (['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) && url.searchParams.get('sslmode') === 'disable') return url.toString();
  url.searchParams.set('sslmode', 'verify-full');
  return url.toString();
}
