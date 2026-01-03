import { NextResponse } from "next/server";
import {
  getPublicSettings,
  getSetting,
  getSettings,
  getSettingsGrouped,
  updateSetting,
  updateSettings,
} from "@/controllers/settingsController";
import { requireAdminAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const category = searchParams.get("category");
    const grouped = searchParams.get("grouped");
    const publicOnly = searchParams.get("public");

    // Get a specific setting by key
    if (key) {
      const data = await getSetting(key);
      return NextResponse.json({ success: true, data });
    }

    // Get public settings only
    if (publicOnly === "true") {
      const data = await getPublicSettings();
      return NextResponse.json({ success: true, data });
    }

    // Get settings grouped by category
    if (grouped === "true") {
      const data = await getSettingsGrouped();
      return NextResponse.json({ success: true, data });
    }

    // Get all settings, optionally filtered by category
    const data = await getSettings(category);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  // Require admin authentication for updating settings
  const auth = await requireAdminAuth(request, "admin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();

    // Handle bulk update
    if (Array.isArray(body)) {
      const data = await updateSettings(body);
      return NextResponse.json({ success: true, data });
    }

    // Handle single setting update
    const { key, value, type } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Setting key is required" },
        { status: 400 },
      );
    }

    const data = await updateSetting(key, value, type);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating settings:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message },
      { status },
    );
  }
}
