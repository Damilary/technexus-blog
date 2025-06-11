import jwt, { Secret, JwtPayload, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { User, UserRole, Context } from "../graphql/types";

export const SECRET_KEY: Secret = process.env.JWT_SECRET;

interface TokenPayload {
  userId: string;
}

export async function getUserFromToken(
  token: string,
  jwtSecret: string,
  prisma: PrismaClient
): Promise<User | null> {
  try {
    const verifiedToken = verify(token, jwtSecret) as TokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: verifiedToken.userId },
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

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role as UserRole,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
