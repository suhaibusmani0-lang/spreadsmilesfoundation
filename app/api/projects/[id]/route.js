import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

export async function GET(req, { params }) {
  const { id } = params;

  const fallback = fallbackProjects.find((p) => p.id === id);
  if (fallback) {
    return NextResponse.json(fallback);
  }

  try {
    await connectToDatabase();

    let project = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }
    if (!project) {
      project = await Project.findOne({ _id: id });
    }

    if (!project) {
      return NextResponse.json(fallbackProjects[0]);
    }

    return NextResponse.json(project);
  } catch (error) {
    console.warn('Error fetching project from DB, using fallback:', error.message);
    return NextResponse.json(fallbackProjects[0]);
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    const updated = await Project.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated || body);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 });
  }
}
