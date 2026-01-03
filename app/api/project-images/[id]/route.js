import { NextResponse } from "next/server";
import {
  deleteProjectImage,
  getProjectImageById,
  updateProjectImage,
} from "@/controllers/projectImagesController";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const data = await getProjectImageById(id);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === "Project image not found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await updateProjectImage(id, body);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === "Project image not found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteProjectImage(id);
    return NextResponse.json({
      success: true,
      message: result.message || "Project image deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete project image error:", error);
    const status = error.message === "Project image not found" ? 404 : 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status },
    );
  }
}
