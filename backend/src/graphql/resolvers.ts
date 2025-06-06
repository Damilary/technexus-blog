// backend/src/graphql/resolvers.ts
import { PrismaClient } from "../generated/prisma"; // Import PrismaClient
import {
  // These are now imported from the central types.ts
  Context,
  User,
  UserRole,
  ArticleInput,
  PaginationInput,
  AuthPayload,
  CreateUserInput,
} from "./types";

import { GraphQLError } from "graphql"; // Import GraphQLError
import bcrypt, { hash } from "bcryptjs"; // Import bcryptjs
import jwt, { sign } from "jsonwebtoken"; // Import jsonwebtoken
import { checkRole } from "../middleware/rbac";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-super-secret-key"; // Use environment variable

// JWT_SECRET should be validated at application startup.
// Assuming your GraphQL context provides prisma client instance
// e.g. context: { prisma }

export const resolvers = {
  Query: {
    articles: async (
      _: never,
      { limit = 10, offset = 0 }: PaginationInput,
      { prisma }: Context
    ) => {
      try {
        return await prisma.article.findMany({
          where: { isPublished: true },
          take: limit,
          skip: offset,
          orderBy: { publishedDate: "desc" },
        });
      } catch (error) {
        console.error("Error fetching articles:", error);
        throw new GraphQLError("Could not fetch articles.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    article: async (
      _: never,
      { slug }: { slug: string },
      { prisma }: Context
    ) => {
      try {
        return await prisma.article.findUnique({
          where: { slug, isPublished: true },
        });
      } catch (error) {
        console.error(`Error fetching article with slug ${slug}:`, error);
        throw new GraphQLError("Could not fetch article.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    categories: async (_: never, __: never, { prisma }: Context) => {
      try {
        return await prisma.category.findMany();
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new GraphQLError("Could not fetch categories.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    category: async (
      _: never,
      { slug }: { slug: string },
      { prisma }: Context
    ) => {
      try {
        return await prisma.category.findUnique({
          where: { slug },
        });
      } catch (error) {
        console.error(`Error fetching category with slug ${slug}:`, error);
        throw new GraphQLError("Could not fetch category.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    me: async (
      _: never,
      __: never,
      { user, prisma }: Context
    ): Promise<User | undefined> => {
      if (!user) return undefined;

      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!fullUser) return undefined;

      return {
        ...fullUser,
        role: fullUser.role as UserRole,
      };
    },
  },

  Mutation: {
    login: async (
      _: never,
      { email, password }: { email: string; password: string },
      { prisma }: Context
    ): Promise<AuthPayload> => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new GraphQLError("Invalid email or password.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        throw new GraphQLError("Invalid email or password.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email /*, role: user.role */ }, // Add role if available on user object
        JWT_SECRET,
        { expiresIn: "1d" } // Token expiration time
      );
      // Return a "safe" user object, excluding passwordHash
      const { passwordHash, ...safeUser } = user;
      return {
        token,
        user: safeUser as User, // Cast as User, assuming User type doesn't mandate passwordHash
      };
    },

    signup: async (
      _: never,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string },
      { prisma }: Context
    ): Promise<AuthPayload> => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new GraphQLError("Email already in use.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const saltRounds = 10; // Or a value from environment variables
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await prisma.user.create({
        data: {
          username: name,
          email,
          passwordHash: hashedPassword,
          // role: 'READER' // If you have a default role in your Prisma schema
        },
      });

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email /*, role: newUser.role */ },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      // Return a "safe" user object
      const { passwordHash, ...safeNewUser } = newUser;
      return {
        token,
        user: safeNewUser as User, // Cast as User
      };
    },

    createArticle: async (
      _: never,
      { input }: { input: ArticleInput },
      { prisma, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError("Authentication required.", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const allowedRoles = [
        UserRole.CONTRIBUTOR,
        UserRole.EDITOR,
        UserRole.ADMIN,
      ] as UserRole[];
      if (!allowedRoles.includes(user.role as unknown as UserRole)) {
        throw new GraphQLError("Not authorized to create articles", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      return await prisma.article.create({
        data: {
          ...input,
          authorId: user.id,
        },
      });
    },

    updateArticle: async (
      _: never,
      { id, input }: { id: string; input: ArticleInput },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Authentication required.");

      const articleToUpdate = await prisma.article.findUnique({
        where: { id },
        select: { authorId: true }, // Only fetch authorId for the check
      });

      if (!articleToUpdate) {
        throw new GraphQLError("Article not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (articleToUpdate.authorId !== user.id /* && user.role !== 'ADMIN' */) {
        // Add admin override if needed
        throw new GraphQLError("Not authorized to update this article.", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      return await prisma.article.update({
        where: { id },
        data: input,
      });
    },

    deleteArticle: async (
      _: never,
      { id }: { id: string },
      { prisma, user }: Context
    ): Promise<boolean> => {
      if (!user)
        throw new GraphQLError("Authentication required.", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      const articleToDelete = await prisma.article.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!articleToDelete) {
        throw new GraphQLError("Article not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (articleToDelete.authorId !== user.id /* && user.role !== 'ADMIN' */) {
        throw new GraphQLError("Not authorized to delete this article.", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      await prisma.article.delete({ where: { id } });
      return true;
    },
  },
};

export const userResolvers = {
  Mutation: {
    signup: async (
      _: never,
      { input }: { input: CreateUserInput },
      { prisma }: Context
    ): Promise<AuthPayload> => {
      const hashedPassword = await hash(input.password, 10);
      const user = await prisma.user.create({
        data: {
          email: input.email,
          username: input.email.split("@")[0], // Default username from email
          passwordHash: hashedPassword,
          role: input.role ?? UserRole.USER,
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = sign({ userId: user.id }, JWT_SECRET);
      return {
        token,
        user: {
          ...user,
          role: user.role as UserRole,
        },
      };
    },

    updateUserRole: async (
      _: never,
      { userId, role }: { userId: string; role: UserRole },
      { prisma, user }: Context
    ) => {
      checkRole(user, [UserRole.ADMIN]);

      return prisma.user.update({
        where: { id: userId },
        data: { role },
      });
    },
  },
};
