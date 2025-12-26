import {
  validateInvitation,
  createAdminFromInvitation,
} from "@/controllers/adminsController";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const invitation = await validateInvitation(token);
    return NextResponse.json(invitation);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

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
