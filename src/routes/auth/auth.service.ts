import { env } from '@/config/env';
import { prisma } from '@/db/prisma';
import { SignIn, SignUp } from '@/types';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

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
  async signIn(signInData: SignIn) {
    const { email, password } = signInData;

    // find user
    const user = await prisma.user.findUnique({ where: { email, isActive: true } });

    if (!user) {
      throw new Error('Invalid Credentials');
    }

    // compare password
    const isMatch = await argon2.verify(user.password!, password);
    if (!isMatch) {
      throw new Error('Invalid Credentials');
    }

    // create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: '1h',
        algorithm: 'HS256',
        issuer: 'ecom',
      }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },
};
