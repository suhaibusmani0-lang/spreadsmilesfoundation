import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Program from '@/models/Program';
import Gallery from '@/models/Gallery';
import Document from '@/models/Document';
import Donation from '@/models/Donation';
import { getProjects, getPrograms, getGallery, getDocuments } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    const [projCount, progCount, galCount, docCount, donationAggr] = await Promise.all([
      Project.countDocuments(),
      Program.countDocuments(),
      Gallery.countDocuments(),
      Document.countDocuments(),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    const totalDonations = donationAggr?.[0]?.total || 0;

    return NextResponse.json({
      projects: projCount,
      programs: progCount,
      gallery: galCount,
      documents: docCount,
      totalDonations,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.warn('Admin stats DB read failed, using dataStore counts:', error.message);
    const [projectsList, programsList, galleryList, documentsList] = await Promise.all([
      getProjects(),
      getPrograms(),
      getGallery(),
      getDocuments(),
    ]);

    return NextResponse.json({
      projects: projectsList.length,
      programs: programsList.length,
      gallery: galleryList.length,
      documents: documentsList.length,
      totalDonations: 0,
    });
  }
}
