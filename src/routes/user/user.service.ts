import { prisma } from '@/db/prisma';

export const UserService = {
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: false,
        RefreshToken: false,
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        email: true,
        role: true,
        emailVerified: true,
        avatar: true,
        isActive: true,
        gender: true,
        paymentMethod: true,
        Address: true,
      },
    });

    return user;
  },
};
