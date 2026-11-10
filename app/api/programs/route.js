import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    await connectToDatabase();
    const programs = await Program.find({}).sort({ created_at: -1 });
    if (programs.length === 0) {
      return NextResponse.json(fallbackPrograms);
    }
    return NextResponse.json(programs);
  } catch (error) {
    console.warn('MongoDB not reachable for programs, using fallback data:', error.message);
    return NextResponse.json(fallbackPrograms);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const program = await Program.create(data);
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ message: error.message || 'Failed to create program' }, { status: 500 });
  }
}
