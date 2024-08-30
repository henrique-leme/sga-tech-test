import { z, ZodError } from 'zod';

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is missing or empty'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is missing or empty'),
});

const mapZodErrorMessages = (zodError: ZodError): string[] => {
  return zodError.errors.map((error) => {
    const path = error.path.length ? error.path.join('.') : 'root';
    return `Invalid value at ${path}: ${error.message}`;
  });
};

const env = envSchema.safeParse(rawEnv);

if (!env.success) {
  if (env.error instanceof ZodError) {
    const issues = mapZodErrorMessages(env.error);
    console.error(
      'Invalid environment variables:',
      JSON.stringify(issues, null, 2),
    );
  }
  throw new Error('Invalid environment variables');
}

export const validatedEnv = env.data;
