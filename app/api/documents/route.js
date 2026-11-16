import { NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/dataStore';

export async function GET() {
  try {
    const docs = await getDocuments();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const doc = await createDocument(data);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ message: error.message || 'Failed to create document' }, { status: 500 });
  }
}
