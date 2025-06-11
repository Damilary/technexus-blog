import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '../auth'; // Adjust path as necessary

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

describe('getUserFromToken', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should return user data if token is valid and user exists', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    const mockToken = 'valid-token';
    const decodedToken = { userId: '1' };

    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const user = await getUserFromToken(mockToken, JWT_SECRET, prisma);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: decodedToken.userId } });
    expect(user).toEqual(mockUser);
  });

  it('should return null if token is invalid', async () => {
    const mockToken = 'invalid-token';
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const user = await getUserFromToken(mockToken, JWT_SECRET, prisma);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(user).toBeNull();
  });

  it('should return null if token is expired', async () => {
    const mockToken = 'expired-token';
    const
      error = new jwt.TokenExpiredError('jwt expired', new Date());
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const user = await getUserFromToken(mockToken, JWT_SECRET, prisma);
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(user).toBeNull();
  });

  it('should return null if token is valid but user is not found in DB', async () => {
    const mockToken = 'valid-token-no-user';
    const decodedToken = { userId: '2' };

    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const user = await getUserFromToken(mockToken, JWT_SECRET, prisma);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: decodedToken.userId } });
    expect(user).toBeNull();
  });

  it('should return null if token is empty', async () => {
    const user = await getUserFromToken('', JWT_SECRET, prisma);
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(user).toBeNull();
  });

  it('should return null if decoded token does not have userId', async () => {
    const mockToken = 'valid-token-no-userid';
    const decodedToken = { email: 'test@example.com' }; // No userId

    (jwt.verify as jest.Mock).mockReturnValue(decodedToken as any); // Cast to any to bypass type check for testing

    const user = await getUserFromToken(mockToken, JWT_SECRET, prisma);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(user).toBeNull();
  });
});
