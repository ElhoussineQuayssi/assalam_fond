import { NextResponse } from "next/server";
import {
  createBlogPost,
  getAllBlogPosts,
} from "@/controllers/blogPostsController";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const sortBy = searchParams.get("sortBy") || "updated_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const locale = searchParams.get("locale") || "";

    console.log("API GET /api/blog-posts called with params:", {
      page,
      limit,
      search,
      status,
      category,
      sortBy,
      sortOrder,
      locale,
    });

    const data = await getAllBlogPosts({
      page,
      limit,
      search,
      status,
      category,
      sortBy,
      sortOrder,
      locale,
    });

    console.log("API returning data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await createBlogPost(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
