import { NextResponse } from 'next/server';
import { getDocumentById, updateDocument, deleteDocument } from '@/lib/dataStore';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const doc = await getDocumentById(id);

    if (!doc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch (error) {
    console.error('Error in GET /api/documents/[id]:', error);
    return NextResponse.json({ message: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await updateDocument(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/documents/[id]:', error);
    return NextResponse.json({ message: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await deleteDocument(id);
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/documents/[id]:', error);
    return NextResponse.json({ message: 'Failed to delete document' }, { status: 500 });
  }
}
