import { prisma } from '@/db/prisma';
import { SignUp } from '@/types';
import argon2 from 'argon2';

export const AuthService = {
  async signUp(signUpData: SignUp) {
    // hash password
    const hashedPassword = await argon2.hash(signUpData.password, {
      type: argon2.argon2id, // best type,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // Iterations
      parallelism: 1, // Threads
    });

    return prisma.user.create({
      data: {
        ...signUpData,
        password: hashedPassword,
      },
    });
  },
  async signIn() {},
};
