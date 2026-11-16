import { NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get('fresh') === '1';
    const projects = await getProjects(forceFresh);
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const project = await createProject(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: error.message || 'Failed to create project' }, { status: 500 });
  }
}
