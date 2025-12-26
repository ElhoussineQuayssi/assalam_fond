import { getAllAdmins, createInvitation } from '@/controllers/adminsController';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getAllAdmins();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await createInvitation(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}