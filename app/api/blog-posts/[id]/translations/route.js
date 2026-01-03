import { NextResponse } from "next/server";
import {
  getBlogPostWithTranslations,
  saveBlogTranslations,
} from "@/controllers/blogPostsController";
import { createAdminClient } from "@/utils/supabase/client";

const supabase = createAdminClient();

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const data = await getBlogPostWithTranslations(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in translations API:", error);
    const status = error.message === "Blog post not found" ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate that blog post exists
    const { data: blogPost, error: blogError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("id", id)
      .single();

    if (blogError || !blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    const data = await saveBlogTranslations(id, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error saving blog translations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
