import { env } from '@/config/env';
import { sevenDays } from '@/constants';
import { prisma } from '@/db/prisma';
import { SignIn, SignUp } from '@/types';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const generateTokens = ({
  id,
  firstName,
  lastName,
  email,
  role,
}: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}) => {
  // create access token
  const accessToken = jwt.sign(
    {
      id: id,
      name: `${firstName} ${lastName}`,
      email: email,
      role: role,
    },
    env.JWT_SECRET,
    {
      expiresIn: '1h',
      algorithm: 'HS256',
      issuer: 'ecom',
    }
  );

  // create refresh token
  const refreshToken = jwt.sign(
    {
      id: id,
      name: `${firstName} ${lastName}`,
      email: email,
      role: role,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
      algorithm: 'HS256',
      issuer: 'ecom',
    }
  );

  return { accessToken, refreshToken };
};

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

    const { accessToken, refreshToken } = generateTokens({ ...user });

    // create refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + sevenDays), // 7days
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },
  async getRefreshToken(token: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    return refreshToken;
  },
  async generateNewTokens(refreshToken: string) {
    // decode refresh token
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };

    // generate new token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({ ...decoded });

    // revoke old and store new refresh token
    await prisma.$transaction([
      // update refresh token, to be deleted in background worker/cron job
      prisma.refreshToken.update({
        where: { token: refreshToken },
        data: {
          revoked: true,
          replacedBy: newRefreshToken,
        },
      }),

      // create new refresh token
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: decoded.id,
          expiresAt: new Date(Date.now() + sevenDays), // 7days
        },
      }),
    ]);

    return {
      accessToken,
      newRefreshToken,
    };
  },
  async changePassword({ password, userId }: { password: string; userId: string }) {
    // hash password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id, // best type,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // Iterations
      parallelism: 1, // Threads
    });

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
  },
};
