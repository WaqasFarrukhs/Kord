import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { healthSchema, readinessSchema } from '@kord/contracts';

type Dependencies = {
  origins: string[];
  checkDatabase: () => Promise<void>;
  log?: (entry: Record<string, unknown>) => void;
};
export function createApp({ origins, checkDatabase, log = () => {} }: Dependencies) {
  const app = new Hono();
  app.use('*', secureHeaders());
  app.use('/api/*', cors({ origin: origin => origins.includes(origin) ? origin : '', allowMethods: ['GET', 'OPTIONS'] }));
  app.use('*', async (c, next) => {
    const start = performance.now();
    await next();
    log({ event: 'request', method: c.req.method, status: c.res.status, durationMs: Math.round(performance.now() - start) });
  });
  app.get('/api/v1/health', c => c.json(healthSchema.parse({ status: 'ok', service: 'kord-api', apiVersion: 'v1' })));
  app.get('/api/v1/ready', async c => {
    try {
      await checkDatabase();
      return c.json(readinessSchema.parse({ status: 'ready' }));
    } catch {
      return c.json(readinessSchema.parse({ status: 'unavailable' }), 503);
    }
  });
  app.notFound(c => c.json({ error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }, 404));
  app.onError((_error, c) => {
    log({ event: 'request_error' });
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Request could not be completed' } }, 500);
  });
  return app;
}
