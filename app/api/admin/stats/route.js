import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Program from '@/models/Program';
import Gallery from '@/models/Gallery';
import Document from '@/models/Document';
import Donation from '@/models/Donation';
import { getProjects, getPrograms, getGallery, getDocuments } from '@/lib/dataStore';

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

    // If DB is empty, use dataStore counts
    const projectsList = await getProjects();
    const programsList = await getPrograms();
    const galleryList = await getGallery();
    const documentsList = await getDocuments();

    return NextResponse.json({
      projects: Math.max(projCount, projectsList.length),
      programs: Math.max(progCount, programsList.length),
      gallery: Math.max(galCount, galleryList.length),
      documents: Math.max(docCount, documentsList.length),
      totalDonations,
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
