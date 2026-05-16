import 'dotenv/config';
import * as z from 'zod';

interface Envs {
  PORT: number;
  NATS_SERVERS: string[];
  DATABASE_URL: string;
}

const envsSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'PORT debe ser un número',
    }),
  NATS_SERVERS: z
    .string()
    .transform((val) => val.split(','))
    .refine((arr) => arr.every((url) => url.startsWith('nats://')), {
      message: 'NATS_SERVERS debe contener URLs válidas de NATS',
    }),
  DATABASE_URL: z.string().url(),
});

const envVars = envsSchema.parse(process.env);

export const envs: Envs = {
  PORT: envVars.PORT,
  NATS_SERVERS: envVars.NATS_SERVERS,
  DATABASE_URL: envVars.DATABASE_URL,
};
