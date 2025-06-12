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

console.log(decodedToken);

describe('GraphQL User Resolvers', () => {
  let prisma: PrismaClient;
  let mockContext: Context;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockContext = {
      prisma,
      user: null, // Initially no user in context
    };
    process.env.JWT_SECRET = 'test-secret'; // Set JWT_SECRET for testing
    jest.clearAllMocks();
  });

  // User Resolvers (from userResolvers.Mutation)
  describe('signup Mutation', () => {
    it('should create a new user and return a token on successful signup', async () => {
      const args = { input: { name: 'New User', email: 'new@example.com', password: 'password123' } };
      const hashedPassword = await bcrypt.hash(args.input.password, 10);
      // name is not used in user creation, username is derived from email
      const mockUserFromDb = { id: '2', email: args.input.email, username: args.input.email.split('@')[0], password: hashedPassword };
      const expectedUserResponse = { id: '2', email: args.input.email, username: args.input.email.split('@')[0] };
      const token = 'mockToken';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(expectedUserResponse); // Prisma create returns selected fields
      (jwt.sign as jest.Mock).mockReturnValue(token);

      // Assuming JWT_SECRET is accessible or passed correctly to the actual signup function if it's used there.
      // If JWT_SECRET is directly used from process.env in resolver, this test mock for jwt.sign is fine.
      const result = await userResolvers.Mutation.signup(null, args, mockContext);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: args.input.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(args.input.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: args.input.email,
          password: hashedPassword,
          username: args.input.email.split('@')[0],
        },
        select: {
          id: true,
          email: true,
          username: true,
        },
      });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUserFromDb.id }, 'test-secret', { expiresIn: '1d' });
      expect(result).toEqual({ token, user: expectedUserResponse });
    });

    it('should throw an error if email already exists', async () => {
      const args = { input: { name: 'Existing User', email: 'exists@example.com', password: 'password123' } };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: args.input.email }); // User exists

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
      const args = { input: { email: 'test@example.com', password: 'password123' } };
      const mockUser = { id: '1', email: args.input.email, password: 'hashedPassword', name: 'Test User' };
      const token = 'mockToken';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password matches
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await commonResolvers.Mutation.login(null, args, mockContext);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: args.input.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(args.input.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, 'test-secret', { expiresIn: '1d' });
      expect(result).toEqual({ token, user: mockUser });
    });

    it('should throw an error for non-existent email', async () => {
      const args = { input: { email: 'nouser@example.com', password: 'password123' } };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // User not found

      await expect(commonResolvers.Mutation.login(null, args, mockContext))
        .rejects
        .toThrow('Invalid email or password.');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error for incorrect password', async () => {
      const args = { input: { email: 'test@example.com', password: 'wrongpassword' } };
      const mockUser = { id: '1', email: args.input.email, password: 'hashedPassword' };
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
