import { expect, it } from 'vitest';
import { readConfig } from './config';
it('rejects missing database configuration and invalid ports', () => {
  expect(() => readConfig({})).toThrow();
  expect(() => readConfig({ DATABASE_URL: 'postgresql://localhost/test', PORT: '0' })).toThrow();
});
it('requires HTTPS browser origins in production', () => {
  expect(() => readConfig({ DATABASE_URL: 'postgresql://localhost/test', NODE_ENV: 'production' })).toThrow();
  expect(readConfig({ DATABASE_URL: 'postgresql://localhost/test', NODE_ENV: 'production', WEB_ORIGINS: 'https://family.example.com' }).PORT).toBe(3000);
});
