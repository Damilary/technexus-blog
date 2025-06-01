import jwt, { Secret, JwtPayload, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '../generated/prisma' // Import PrismaClient
import { User } from "../graphql/types";

export const SECRET_KEY: Secret = "your-secret-key-here";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;

    next();
  } catch (error) {
    console.error("Auth error:", error);
  }
};

interface TokenPayload {
  userId: string;
}

export interface Context {
  prisma: PrismaClient;
  user: User | null;
}

export async function createContext(
  { req }: { req: Request },
  prisma: PrismaClient
): Promise<Context> {
  const auth = req?.headers?.authorization;

  if (auth) {
    try {
      const token = auth.replace("Bearer ", "");
      const verifiedToken = verify(
        token,
        process.env.JWT_SECRET!
      ) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: verifiedToken.userId },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
        },
      });

      return { prisma, user };
    } catch (error) {
      console.error("Auth error:", error);
    }
  }

  return { prisma, user: null };
}
