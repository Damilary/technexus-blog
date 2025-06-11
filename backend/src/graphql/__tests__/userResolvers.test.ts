import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { userResolvers, resolvers as commonResolvers } from '../resolvers'; // Adjust path
import { Context } from '../types'; // Adjust path

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'; // Use an environment variable for the JWT secret

describe('GraphQL User Resolvers', () => {
  let prisma: PrismaClient;
  let mockContext: Context;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockContext = {
      prisma,
      user: null, // Initially no user in context
    };
    jest.clearAllMocks();
  });

  // User Resolvers (from userResolvers.Mutation)
  describe('signup Mutation', () => {
    it('should create a new user and return a token on successful signup', async () => {
      const args = { name: 'New User', email: 'new@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const mockUser = { id: '2', ...args, password: hashedPassword };
      const token = 'mockToken';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      // Assuming JWT_SECRET is accessible or passed correctly to the actual signup function if it's used there.
      // If JWT_SECRET is directly used from process.env in resolver, this test mock for jwt.sign is fine.
      const result = await userResolvers.Mutation.signup(null, args, mockContext);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: args.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(args.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: { name: args.name, email: args.email, password: hashedPassword } });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET || "your-super-secret-key", { expiresIn: '1d' });
      expect(result).toEqual({ token, user: mockUser });
    });

    it('should throw an error if email already exists', async () => {
      const args = { name: 'Existing User', email: 'exists@example.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: args.email }); // User exists

      await expect(userResolvers.Mutation.signup(null, args, mockContext))
        .rejects
        .toThrow('User already exists with this email.');

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('login Mutation', () => {
    it('should return a token and user on successful login', async () => {
      const args = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: '1', email: args.email, password: 'hashedPassword', name: 'Test User' };
      const token = 'mockToken';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password matches
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await commonResolvers.Mutation.login(null, args, mockContext);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: args.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(args.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, process.env.JWT_SECRET || "your-super-secret-key", { expiresIn: '1d' });
      expect(result).toEqual({ token, user: mockUser });
    });

    it('should throw an error for non-existent email', async () => {
      const args = { email: 'nouser@example.com', password: 'password123' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // User not found

      await expect(commonResolvers.Mutation.login(null, args, mockContext))
        .rejects
        .toThrow('Invalid email or password.');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error for incorrect password', async () => {
      const args = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { id: '1', email: args.email, password: 'hashedPassword' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password does not match

      await expect(commonResolvers.Mutation.login(null, args, mockContext))
        .rejects
        .toThrow('Invalid email or password.');

      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('me Query', () => {
    it('should return user details if user is authenticated', async () => {
      const authenticatedUser = { id: '1', email: 'me@example.com', name: 'Authenticated User' };
      mockContext.user = authenticatedUser;

      const result = await commonResolvers.Query.me(null, {}, mockContext);

      expect(result).toEqual(authenticatedUser);
    });

    it('should return null if no user is authenticated', async () => {
      mockContext.user = null;

      const result = await commonResolvers.Query.me(null, {}, mockContext);
      expect(result).toBeNull();
    });
  });
});
