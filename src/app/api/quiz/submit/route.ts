import { NextRequest, NextResponse } from "next/server";
import * as quizService from "@/lib/services/quizService";
import { handleApiError } from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await quizService.evaluateAnswers(body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
