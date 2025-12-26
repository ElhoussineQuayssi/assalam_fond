import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/controllers/blogPostsController';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await getBlogPostById(id);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === 'Blog post not found' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await updateBlogPost(id, body);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === 'Blog post not found' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteBlogPost(id);
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}