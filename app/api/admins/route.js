import { NextResponse } from "next/server";
import { createInvitation, getAllAdmins } from "@/controllers/adminsController";
import { requireAdminAuth } from "@/lib/auth";

export async function GET(request) {
  // Require super_admin role for viewing all admins
  const auth = await requireAdminAuth(request, "super_admin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const data = await getAllAdmins();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  // Require super_admin role for creating admin invitations
  const auth = await requireAdminAuth(request, "super_admin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const data = await createInvitation({
      ...body,
      created_by: auth.user.id, // Track who created the invitation
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
