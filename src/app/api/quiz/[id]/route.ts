import { NextRequest, NextResponse } from "next/server";
import * as quizService from "@/lib/services/quizService";
import { handleApiError } from "@/lib/apiResponse";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const question = await quizService.getQuizQuestionById(id);
    return NextResponse.json(question);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await quizService.updateQuestion(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await quizService.deleteQuestion(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
