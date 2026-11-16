import { NextResponse } from 'next/server';
import { getPrograms, createProgram } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get('fresh') === '1';
    const programs = await getPrograms(forceFresh);
    return NextResponse.json(programs, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const program = await createProgram(data);
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ message: error.message || 'Failed to create program' }, { status: 500 });
  }
}
