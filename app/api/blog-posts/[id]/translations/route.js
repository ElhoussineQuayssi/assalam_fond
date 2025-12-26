import { getBlogPostWithTranslations } from '@/controllers/blogPostsController';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await getBlogPostWithTranslations(id);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === 'Blog post not found' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
