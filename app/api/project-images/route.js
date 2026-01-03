import { NextResponse } from "next/server";
import {
  createProjectImage,
  getAllProjectImages,
} from "@/controllers/projectImagesController";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");
    const status = searchParams.get("status");

    const filters = {};
    if (project_id) filters.project_id = project_id;
    if (status) filters.status = status;

    const data = await getAllProjectImages(filters);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await createProjectImage(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
