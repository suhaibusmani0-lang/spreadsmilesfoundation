import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    const updated = await Gallery.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete item' }, { status: 500 });
  }
}
