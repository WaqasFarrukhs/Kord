import { z } from 'zod';

export const healthSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('kord-api'),
  apiVersion: z.literal('v1'),
});
export type Health = z.infer<typeof healthSchema>;
export const readinessSchema = z.object({ status: z.enum(['ready', 'unavailable']) });
export type Readiness = z.infer<typeof readinessSchema>;
export const errorSchema = z.object({ error: z.object({ code: z.string(), message: z.string() }) });
