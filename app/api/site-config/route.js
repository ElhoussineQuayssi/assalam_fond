import { NextResponse } from "next/server";
import {
  getSiteConfig,
  updateSiteConfig,
} from "@/controllers/siteConfigController";

export async function GET() {
  try {
    const data = await getSiteConfig();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = await updateSiteConfig(body);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === "Site config not found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
