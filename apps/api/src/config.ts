import { z } from 'zod';
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url().refine(v => /^postgres(ql)?:/.test(v)),
  WEB_ORIGINS: z.string().default('http://localhost:8081').transform(value => value.split(',').map(v => z.url().parse(v.trim()))),
});
export function readConfig(env: Record<string, string | undefined>) {
  const config = schema.parse(env);
  if (config.NODE_ENV === 'production' && config.WEB_ORIGINS.some(origin => !origin.startsWith('https://'))) {
    throw new Error('Production web origins require HTTPS');
  }
  return config;
}
