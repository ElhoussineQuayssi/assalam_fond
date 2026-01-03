import { NextResponse } from "next/server";
import {
  deleteAdmin,
  getAdminById,
  updateAdmin,
} from "@/controllers/adminsController";
import { requireAdminAuth } from "@/lib/auth";

export async function GET(request, { params }) {
  // Require super_admin for viewing individual admin details
  const auth = await requireAdminAuth(request, "super_admin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

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
  // Require super_admin for updating admin details
  const auth = await requireAdminAuth(request, "super_admin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

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
  // Require super_admin for deleting admins
  const auth = await requireAdminAuth(request, "super_admin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    await deleteAdmin(id);
    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
