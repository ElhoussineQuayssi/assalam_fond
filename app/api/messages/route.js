import { getAllMessages, createMessage } from '@/controllers/messagesController';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getAllMessages();
    
    // Debug logging to check database response
    console.log('API Route - Database response:', data);
    console.log('API Route - Data type:', typeof data);
    console.log('API Route - Data length:', data?.length);
    if (data && data.length > 0) {
      console.log('API Route - First message from DB:', data[0]);
      console.log('API Route - First message subject:', data[0]?.subject);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createMessage(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}