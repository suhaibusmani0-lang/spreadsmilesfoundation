import { NextResponse } from 'next/server';
import { getGallery, createGallery } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get('fresh') === '1';
    const gallery = await getGallery(forceFresh);
    return NextResponse.json(gallery, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
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
