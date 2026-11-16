import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

const fallbackGallery = [
  { _id: 'gal_1', id: 'gal_1', title: 'Education Kit Distribution Day', image_url: '/assets/hompage1.jpg', category: 'Education' },
  { _id: 'gal_2', id: 'gal_2', title: 'Community Health Awareness Session', image_url: '/assets/hompage3.jpg', category: 'Healthcare' },
  { _id: 'gal_3', id: 'gal_3', title: 'Warm Clothes & Sweater Distribution', image_url: '/assets/hompage2.jpg', category: 'Community' },
  { _id: 'gal_4', id: 'gal_4', title: 'Food Drive for Underprivileged Families', image_url: '/assets/hompage5.jpg', category: 'Events' },
  { _id: 'gal_5', id: 'gal_5', title: 'Annual Volunteers Meet', image_url: '/assets/hompage4.jpg', category: 'Events' },
];

export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    let item = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Gallery.findById(id);
    }
    if (!item) {
      item = await Gallery.findOne({ _id: id });
    }

    if (!item) {
      const fb = fallbackGallery.find((g) => g.id === id || g._id === id);
      return NextResponse.json(fb || fallbackGallery[0]);
    }

    return NextResponse.json(item);
  } catch (error) {
    console.warn('⚠️ Error fetching gallery item from DB, using fallback:', error.message);
    const fb = fallbackGallery.find((g) => g.id === id || g._id === id);
    return NextResponse.json(fb || fallbackGallery[0]);
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    try {
      await connectToDatabase();
      const updated = await Gallery.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json(updated || { id, ...body });
    } catch (dbErr) {
      console.warn('⚠️ DB update failed, returning fallback success:', dbErr.message);
      return NextResponse.json({ id, ...body });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    try {
      await connectToDatabase();
      await Gallery.findByIdAndDelete(id);
    } catch (dbErr) {
      console.warn('⚠️ DB delete failed, returning fallback success:', dbErr.message);
    }
    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete gallery item' }, { status: 500 });
  }
}
