import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/client";

const anonClient = createClient();
const adminClient = createAdminClient();

const errorResponse = (message, status = 400, details = null) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };
  if (details) {
    response.details = details;
  }
  return NextResponse.json(response, { status });
};

const successResponse = (data, status = 200) => {
  return NextResponse.json(
    {
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get("project_id");
    const lang = searchParams.get("lang");

    if (!project_id) {
      return errorResponse("project_id query param is required", 400);
    }

    let query = anonClient
      .from("project_translations")
      .select("*")
      .eq("project_id", project_id);

    // If lang is specified, fetch single translation, otherwise fetch all for project
    if (lang) {
      query = query.eq("lang", lang).single();
    }

    const { data, error } = await query;

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
      return errorResponse(
        "Failed to fetch translation",
        500,
        error.message || "Database error",
      );
    }

    // Return array if fetching all translations, single object if fetching specific lang
    return successResponse(
      lang ? data || null : Array.isArray(data) ? data : [],
    );
  } catch (err) {
    console.error("Server error:", err);
    return errorResponse("Internal server error", 500, err.message);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received translation payload:", body);
    const {
      project_id,
      lang,
      title,
      excerpt,
      people_helped,
      content,
      slug,
      metadata,
    } = body;

    if (!project_id || !lang) {
      return errorResponse("project_id and lang are required in body", 400);
    }

    const payload = {
      project_id,
      lang,
      title: title || null,
      excerpt: excerpt || null,
      people_helped: people_helped || null,
      content: content || null,
      slug: slug || null,
      metadata: metadata || {},
      updated_at: new Date().toISOString(),
    };

    // Use admin client for writes
    const { data, error } = await adminClient
      .from("project_translations")
      .upsert(payload, { onConflict: ["project_id", "lang"] })
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      // handle unique slug violation explicitly
      if (error.code === "23505" || error.message?.includes("duplicate key")) {
        return errorResponse(
          "Slug already in use",
          409,
          error.message || "Duplicate slug error",
        );
      }
      return errorResponse(
        "Failed to upsert translation",
        500,
        error.message || "Database upsert error",
      );
    }

    return successResponse(data[0] || data);
  } catch (err) {
    console.error("Server error:", err);
    return errorResponse("Internal server error", 500, err.message);
  }
}
