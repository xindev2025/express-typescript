import { UserService } from '../../src/routes/user/user.service';
import { AuthService } from '../../src/routes/auth/auth.service';
import { prisma } from '../../src/db/prisma';
import argon2 from 'argon2';

jest.mock('argon2');
jest.mock('../../src/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('AuthService.signUp', () => {
  const fakeSignUpData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'plainPassword',
    dateOfBirth: new Date('2000-01-01'),
  };

  const fakeHashedPassword = 'password';

  const fakeUserRecord = {
    ...fakeSignUpData,
    password: fakeHashedPassword,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hashes the password and creates the user', async () => {
    (argon2.hash as jest.Mock).mockResolvedValue(fakeHashedPassword);
    (prisma.user.create as jest.Mock).mockResolvedValue(fakeUserRecord);

    const result = await AuthService.signUp(fakeSignUpData);

    // assert
    expect(argon2.hash).toHaveBeenCalledWith('plainPassword', {
      type: argon2.argon2id, // best type,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // Iterations
      parallelism: 1, // Threads
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...fakeSignUpData,
        password: fakeHashedPassword,
      },
    });
    expect(result).toEqual(fakeUserRecord);
  });
});

describe('userService.getUser (mocked)', () => {
  const fakeUser = {
    id: '9153545b-67a3-488f-a7b5-220025ae0e6e',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('2000-01-01'),
    email: 'john@example.com',
    role: 'user',
    emailVerified: true,
    avatar: null,
    isActive: true,
    gender: 'male',
    paymentMethod: 'paypal',
    Address: [{ id: 'addr1', street: '123 Street' }],
  };

  beforeEach(() => {
    // reset mocks before each test
    jest.resetAllMocks();
  });

  it('return user when found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);

    const result = await UserService.getUser('9153545b-67a3-488f-a7b5-220025ae0e6e');
    expect(result).toEqual(fakeUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
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
  });
});
