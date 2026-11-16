import { NextResponse } from 'next/server';
import { getPrograms, createProgram } from '@/lib/dataStore';

export async function GET() {
  try {
    const programs = await getPrograms();
    return NextResponse.json(programs);
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
