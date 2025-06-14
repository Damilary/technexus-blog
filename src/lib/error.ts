import { toast } from "react-hot-toast";

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(error.message);
    return error;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return new AppError(error.message, "UNKNOWN_ERROR");
  }

  const message = "An unexpected error occurred";
  toast.error(message);
  return new AppError(message, "UNKNOWN_ERROR");
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

// Common error codes
export const ErrorCodes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT: "RATE_LIMIT",
  SERVER_ERROR: "SERVER_ERROR",
} as const;
