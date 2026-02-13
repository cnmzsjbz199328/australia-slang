/** Custom error type names for API error mapping */
export const ErrorType = {
  ValidationError: "ValidationError",
  NotFoundError: "NotFoundError",
  ConflictError: "ConflictError",
} as const;

export type ErrorTypeName = (typeof ErrorType)[keyof typeof ErrorType];
