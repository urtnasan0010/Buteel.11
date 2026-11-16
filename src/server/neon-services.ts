import 'server-only';
import { Pool } from 'pg';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import { postgresUrl } from './postgres-url.mjs';

// Keep one small pool per Node.js process. DATABASE_URL is the pooled Neon URL.
let database: Pool | undefined;
let storage: S3Client | undefined;

export function getDatabase(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  if (!database) {
    database = new Pool({
      connectionString: postgresUrl(process.env.DATABASE_URL),
      max: 3,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      allowExitOnIdle: true,
    });
    // pg removes the failed idle client itself. Handle its error event so it
    // cannot terminate the process; never log credentials or raw driver errors.
    database.on('error', () => {
      console.error('An idle PostgreSQL connection failed; the pool will reconnect.');
    });
  }
  return database;
}

export function getStorage(): S3Client {
  if (!process.env.AWS_ENDPOINT_URL_S3 || !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('Neon object storage is not configured');
  }
  // AWS-standard environment variables supply endpoint, region and credentials.
  storage ??= new S3Client({ forcePathStyle: true });
  return storage;
}

export async function checkNeonServices() {
  const [postgres, objectStorage] = await Promise.allSettled([
    Promise.resolve().then(async () => {
      // Verify the feed schema as well as the connection, without reading post data.
      await getDatabase().query('SELECT id FROM home_posts LIMIT 0');
    }),
    Promise.resolve().then(() => getStorage().send(new HeadBucketCommand({ Bucket: 'assets' }), { abortSignal: AbortSignal.timeout(5000) })),
  ]);
  return {
    postgres: postgres.status === 'fulfilled',
    objectStorage: objectStorage.status === 'fulfilled',
  };
}
