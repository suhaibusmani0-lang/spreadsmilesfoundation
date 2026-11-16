import { NextResponse } from 'next/server';
import { getGallery, createGallery } from '@/lib/dataStore';

export async function GET() {
  try {
    const gallery = await getGallery();
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const item = await createGallery(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ message: error.message || 'Failed to create gallery item' }, { status: 500 });
  }
}
