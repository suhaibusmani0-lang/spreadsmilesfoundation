import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

const fallbackGallery = [
  { id: 'gal_1', title: 'Education Kit Distribution Day', image_url: '/assets/hompage1.jpg', category: 'Education' },
  { id: 'gal_2', title: 'Community Health Awareness Session', image_url: '/assets/hompage3.jpg', category: 'Healthcare' },
  { id: 'gal_3', title: 'Warm Clothes & Sweater Distribution', image_url: '/assets/hompage2.jpg', category: 'Community' },
  { id: 'gal_4', title: 'Food Drive for Underprivileged Families', image_url: '/assets/hompage5.jpg', category: 'Events' },
  { id: 'gal_5', title: 'Annual Volunteers Meet', image_url: '/assets/hompage4.jpg', category: 'Events' },
];

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Gallery.find({}).sort({ created_at: -1 });
    if (items.length === 0) {
      return NextResponse.json(fallbackGallery);
    }
    return NextResponse.json(items);
  } catch (error) {
    console.warn('MongoDB not reachable for gallery, using fallback data:', error.message);
    return NextResponse.json(fallbackGallery);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const item = await Gallery.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ message: error.message || 'Failed to create gallery item' }, { status: 500 });
  }
}
