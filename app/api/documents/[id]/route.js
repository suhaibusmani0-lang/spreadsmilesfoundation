import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Document from '@/models/Document';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    const updated = await Document.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    await Document.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete document' }, { status: 500 });
  }
}
