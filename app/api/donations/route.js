import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Donation from '@/models/Donation';

export async function GET() {
  try {
    await connectToDatabase();
    const donations = await Donation.find({}).sort({ date: -1 });
    return NextResponse.json(donations);
  } catch (error) {
    console.warn('MongoDB not reachable for donations:', error.message);
    return NextResponse.json([]);
  }
}
