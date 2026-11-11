import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import { healthSchema } from '@kord/contracts';
const app = createApp({ origins: ['http://localhost:8081'], checkDatabase: async () => {} });
describe('foundation HTTP API', () => {
  it('returns the shared health contract', async () => {
    const response = await app.request('/api/v1/health');
    expect(response.status).toBe(200);
    expect(healthSchema.parse(await response.json()).status).toBe('ok');
  });
  it('returns database readiness', async () => {
    expect((await app.request('/api/v1/ready')).status).toBe(200);
  });
  it('reports database failure without exposing credentials', async () => {
    const failing = createApp({ origins: [], checkDatabase: async () => { throw new Error('secret-password'); } });
    const response = await failing.request('/api/v1/ready');
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: 'unavailable' });
  });
  it('permits only configured browser origins', async () => {
    for (const origin of ['http://localhost:8081', 'https://evil.example']) {
      const response = await app.request('/api/v1/health', { headers: { Origin: origin } });
      expect(response.headers.get('access-control-allow-origin')).toBe(origin.includes('localhost') ? origin : null);
    }
  });
  it('returns structured missing-route errors', async () => {
    const response = await app.request('/api/v1/missing');
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ error: { code: 'NOT_FOUND' } });
  });
});
