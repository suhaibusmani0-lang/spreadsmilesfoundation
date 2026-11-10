import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Program from '@/models/Program';

const fallbackPrograms = [
  {
    id: 'prog_fallback_1',
    title: 'Education for Underprivileged Children',
    description: 'Providing basic learning, uniforms, books, school bags, and coaching to poor children in slums and informal settlements.',
    image_urls: ['/assets/hompage1.jpg', '/assets/hompage2.jpg'],
    category: 'Education',
    location: 'Shaheen Bagh, Delhi',
    status: 'Active & Ongoing',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prog_fallback_2',
    title: 'Free Healthcare Camps & Medical Checkups',
    description: 'Conducting periodic medical diagnostic camps, distribution of basic medicines, and health awareness sessions for families.',
    image_urls: ['/assets/hompage3.jpg', '/assets/hompage4.jpg'],
    category: 'Healthcare',
    location: 'Jamia Nagar & Okhla, Delhi',
    status: 'Active & Ongoing',
  },
  {
    id: 'prog_fallback_3',
    title: 'Nutritious Meal & Food Relief Drives',
    description: 'Regular dry ration kits and cooked food distribution drives for daily wage workers, homeless, and vulnerable families.',
    image_urls: ['/assets/hompage5.jpg', '/assets/hompage1.jpg'],
    category: 'Nutrition',
    location: 'Delhi NCR',
    status: 'Active & Ongoing',
  },
];

export async function GET(req, { params }) {
  const { id } = params;

  // Check fallback programs first if id matches
  const fallback = fallbackPrograms.find((p) => p.id === id);
  if (fallback) {
    return NextResponse.json(fallback);
  }

  try {
    await connectToDatabase();

    let program = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      program = await Program.findById(id);
    }
    if (!program) {
      program = await Program.findOne({ _id: id });
    }

    if (!program) {
      return NextResponse.json(fallbackPrograms[0]);
    }

    return NextResponse.json(program);
  } catch (error) {
    console.warn('Error fetching program from DB, using fallback:', error.message);
    return NextResponse.json(fallbackPrograms[0]);
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    const updated = await Program.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated || body);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    await Program.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete program' }, { status: 500 });
  }
}
