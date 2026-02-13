import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors/AppError";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
