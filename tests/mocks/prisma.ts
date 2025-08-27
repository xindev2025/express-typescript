import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client/extension';

// create deep mock of prisma client
export const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;
