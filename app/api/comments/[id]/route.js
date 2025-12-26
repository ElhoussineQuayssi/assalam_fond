import { getCommentById, updateComment, deleteComment } from '@/controllers/commentsController';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await getCommentById(id);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === 'Comment not found' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await updateComment(id, body);
    return NextResponse.json(data);
  } catch (error) {
    const status = error.message === 'Comment not found' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteComment(id);
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}