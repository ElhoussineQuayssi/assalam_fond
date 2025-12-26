import {
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "@/controllers/adminsController";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await getAdminById(id);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === "Admin not found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await updateAdmin(id, body);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === "Admin not found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteAdmin(id);
    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
