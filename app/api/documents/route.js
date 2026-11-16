import { NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get('fresh') === '1';
    const docs = await getDocuments(forceFresh);
    return NextResponse.json(docs, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
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
