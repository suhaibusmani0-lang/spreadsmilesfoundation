import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Program from '@/models/Program';
import Gallery from '@/models/Gallery';
import Document from '@/models/Document';
import Donation from '@/models/Donation';

export async function GET() {
  try {
    await connectToDatabase();

    const [projCount, progCount, galCount, docCount, donations] = await Promise.all([
      Project.countDocuments(),
      Program.countDocuments(),
      Gallery.countDocuments(),
      Document.countDocuments(),
      Donation.find({}, 'amount'),
    ]);

    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

    return NextResponse.json({
      projects: projCount,
      programs: progCount,
      gallery: galCount,
      documents: docCount,
      totalDonations,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({
      projects: 0,
      programs: 0,
      gallery: 0,
      documents: 0,
      totalDonations: 0,
    });
  }
}
