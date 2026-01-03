import { NextResponse } from "next/server";
import {
  createAdminFromInvitation,
  validateInvitation,
} from "@/controllers/adminsController";

// GET endpoint for validating invitations (public access for signup flow)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const invitation = await validateInvitation(token);
    // Return limited invitation data for signup form
    return NextResponse.json({
      id: invitation.id,
      name: invitation.name,
      email: invitation.email,
      role: invitation.role,
      expires_at: invitation.expires_at,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST endpoint for creating admin accounts (token-based, no auth header required)
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, ...userData } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const admin = await createAdminFromInvitation(token, userData);
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error("Error creating admin from invitation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
