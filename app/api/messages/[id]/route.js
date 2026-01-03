import { NextResponse } from "next/server";
import { deleteMessage, updateMessage } from "@/controllers/messagesController";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    const updatedMessage = await updateMessage(id, updateData);
    return NextResponse.json(updatedMessage);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    await deleteMessage(id);
    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
