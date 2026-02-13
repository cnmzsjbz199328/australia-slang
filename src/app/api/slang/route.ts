import { NextRequest, NextResponse } from "next/server";
import * as slangService from "@/lib/services/slangService";
import { slangListQuerySchema } from "@/lib/validators/slangSchemas";
import { handleApiError } from "@/lib/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "20";
    const parsed = slangListQuerySchema.safeParse({ q, page, pageSize });
    const params = parsed.success ? parsed.data : { page: 1, pageSize: 20, q };
    const result = await slangService.searchSlang(params);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await slangService.createSlang(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
