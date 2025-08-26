import { prisma } from '@/db/prisma';
import { User } from '@/types';

export const UserService = {
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
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
  async updateUser({ userData, userId }: { userData: User; userId: string }) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: userData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        avatar: true,
        gender: true,
        paymentMethod: true,
      },
    });

    return user;
  },
};
