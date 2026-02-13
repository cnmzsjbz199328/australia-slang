import type { ErrorTypeName } from "./errorTypes";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorTypeName,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function validationError(message: string): AppError {
  return new AppError(message, "ValidationError", 400);
}

export function notFoundError(message: string): AppError {
  return new AppError(message, "NotFoundError", 404);
}

export function conflictError(message: string): AppError {
  return new AppError(message, "ConflictError", 409);
}
