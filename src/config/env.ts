import dotenv from 'dotenv';
import z from 'zod';

// load from .env file
dotenv.config();

// env validation
const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
});

// env parsed
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.log('Invalid environment variables:', parsed.error);
  process.exit(1);
}

export const env = parsed.data;
