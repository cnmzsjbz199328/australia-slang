import { NextRequest, NextResponse } from "next/server";
import * as quizService from "@/lib/services/quizService";
import { handleApiError } from "@/lib/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const list = searchParams.get("list") === "1";
    if (list) {
      const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
      const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)));
      const result = await quizService.getQuizQuestionList(page, pageSize);
      return NextResponse.json(result);
    }
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 10, 50) : 10;
    const questions = await quizService.getRandomQuestions(limit);
    return NextResponse.json({ questions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await quizService.createQuestion(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
