import { NextResponse } from 'next/server';
import { getGalleryById, updateGallery, deleteGallery } from '@/lib/dataStore';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const item = await getGalleryById(id);

    if (!item) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in GET /api/gallery/[id]:', error);
    return NextResponse.json({ message: 'Failed to fetch gallery item' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await updateGallery(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/gallery/[id]:', error);
    return NextResponse.json({ message: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await deleteGallery(id);
    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/gallery/[id]:', error);
    return NextResponse.json({ message: 'Failed to delete gallery item' }, { status: 500 });
  }
}
