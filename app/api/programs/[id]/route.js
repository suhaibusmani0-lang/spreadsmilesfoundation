import { NextResponse } from 'next/server';
import { getProgramById, updateProgram, deleteProgram } from '@/lib/dataStore';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const program = await getProgramById(id);

    if (!program) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json(program, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/programs/[id]:', error);
    return NextResponse.json({ message: 'Failed to fetch program' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = await updateProgram(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/programs/[id]:', error);
    return NextResponse.json({ message: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await deleteProgram(id);
    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/programs/[id]:', error);
    return NextResponse.json({ message: 'Failed to delete program' }, { status: 500 });
  }
}
