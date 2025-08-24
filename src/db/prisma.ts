import { env } from '../config/env';
import { PrismaClient } from '../generated/prisma';

const connectionString = env.DATABASE_URL;

if (!connectionString) throw new Error('Database URL is not set');

export const prisma = new PrismaClient();
