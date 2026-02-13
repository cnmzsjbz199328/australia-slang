import { NextRequest, NextResponse } from "next/server";
import * as slangService from "@/lib/services/slangService";
import { handleApiError } from "@/lib/apiResponse";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const term = await slangService.getSlangById(id);
    return NextResponse.json(term);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await slangService.updateSlang(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await slangService.deleteSlang(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
