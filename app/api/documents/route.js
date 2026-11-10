import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Document from '@/models/Document';

const fallbackDocuments = [
  {
    id: 'doc_1',
    title: 'Spread Smiles Trust Registration Certificate',
    description: 'Official Government registered NGO trust deed and certificate of registration.',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'Certificates',
  },
  {
    id: 'doc_2',
    title: 'Annual Social Impact Report 2024-2025',
    description: 'Comprehensive report highlighting our initiatives, lives impacted, and financial transparency.',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    category: 'Reports',
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    const docs = await Document.find({}).sort({ created_at: -1 });
    if (docs.length === 0) {
      return NextResponse.json(fallbackDocuments);
    }
    return NextResponse.json(docs);
  } catch (error) {
    console.warn('MongoDB not reachable for documents, using fallback data:', error.message);
    return NextResponse.json(fallbackDocuments);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const doc = await Document.create(data);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ message: error.message || 'Failed to create document' }, { status: 500 });
  }
}
