import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';

const fallbackProjects = [
  {
    id: 'proj_fallback_1',
    title: 'Winter Sweater & Warm Clothes Distribution',
    description: 'A dedicated winter relief campaign providing high quality sweaters, thermals, and blankets to children in need.',
    image_urls: ['/assets/hompage2.jpg', '/assets/hompage4.jpg'],
    category: 'Welfare Project',
    location: 'Delhi',
    status: 'In Progress',
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj_fallback_2',
    title: 'Vidyanjali Government School Outreach',
    description: 'Collaborating with community schools to support teaching infrastructure, stationery kits, and digital literacy.',
    image_urls: ['/assets/hompage3.jpg', '/assets/hompage5.jpg'],
    category: 'Education Project',
    location: 'New Delhi',
    status: 'In Progress',
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ created_at: -1 });
    if (projects.length === 0) {
      return NextResponse.json(fallbackProjects);
    }
    return NextResponse.json(projects);
  } catch (error) {
    console.warn('MongoDB not reachable for projects, using fallback data:', error.message);
    return NextResponse.json(fallbackProjects);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: error.message || 'Failed to create project' }, { status: 500 });
  }
}
