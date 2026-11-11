import { healthSchema, readinessSchema } from '@kord/contracts';
import { z } from 'zod';
export function resolveApiUrl(configured: string | undefined, webOrigin?: string): string {
  const value = configured?.trim() || webOrigin;
  if (!value) throw new Error('Set EXPO_PUBLIC_API_URL to your server address, then restart Expo.');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('API address must be an HTTP(S) origin without credentials, a path, or a query.');
  }
  return url.origin;
}
export async function checkConnection(base: string, signal?: AbortSignal) {
  const timeout = new AbortController();
  const abort = () => timeout.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) timeout.abort();
  const timer = setTimeout(abort, 5000);
  try {
    const health = await fetch(`${base}/api/v1/health`, { signal: timeout.signal });
    if (!health.ok) throw new Error('The API health check failed. Check your server address and connection.');
    healthSchema.parse(await health.json());
    const ready = await fetch(`${base}/api/v1/ready`, { signal: timeout.signal });
    if (ready.status !== 200 && ready.status !== 503) throw new Error('The database readiness check failed.');
    const result = readinessSchema.parse(await ready.json());
    if ((ready.status === 200) !== (result.status === 'ready')) throw new Error('Unexpected readiness response.');
    return { databaseReady: result.status === 'ready', checkedAt: new Date().toISOString() };
  } catch (error) {
    if (error instanceof z.ZodError) throw new Error('The server returned an incompatible API response.', { cause: error });
    if (timeout.signal.aborted) throw new Error('Connection check timed out or was cancelled. Try again.', { cause: error });
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}
