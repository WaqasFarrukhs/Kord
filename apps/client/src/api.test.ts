import { afterEach, expect, it, vi } from 'vitest';
import { checkConnection, resolveApiUrl } from './api';
afterEach(() => vi.unstubAllGlobals());
it('uses a configured LAN origin and supports same-origin web deployments', () => {
  expect(resolveApiUrl('http://192.168.1.20:3000')).toBe('http://192.168.1.20:3000');
  expect(resolveApiUrl(undefined, 'https://family.example.com')).toBe('https://family.example.com');
  expect(() => resolveApiUrl(undefined)).toThrow('EXPO_PUBLIC_API_URL');
});
it('rejects credentials, paths and invalid schemes', () => {
  for (const url of ['ftp://host', 'https://user:password@host', 'https://host/api', 'https://host?q=1']) expect(() => resolveApiUrl(url)).toThrow();
});
it('distinguishes a live API from unavailable database', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(Response.json({ status: 'ok', service: 'kord-api', apiVersion: 'v1' })).mockResolvedValueOnce(Response.json({ status: 'unavailable' }, { status: 503 })));
  expect((await checkConnection('http://server')).databaseReady).toBe(false);
});
it('rejects incompatible server responses', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ unexpected: true })));
  await expect(checkConnection('http://server')).rejects.toThrow('incompatible');
});
