import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import Program from '@/models/Program';
import Gallery from '@/models/Gallery';
import Document from '@/models/Document';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await connectToDatabase();

    const progCount = await Program.countDocuments();
    if (progCount === 0) {
      await Program.create([
        {
          title: 'Education for Underprivileged Children',
          description: 'Providing basic learning, uniforms, books, school bags, and coaching to poor children in slums and informal settlements.',
          image_urls: [
            '/assets/hompage1.jpg',
            '/assets/hompage2.jpg'
          ],
          category: 'Education',
          location: 'Shaheen Bagh, Delhi',
          status: 'Active & Ongoing',
        },
        {
          title: 'Free Healthcare Camps & Medical Checkups',
          description: 'Conducting periodic medical diagnostic camps, distribution of basic medicines, and health awareness sessions for families.',
          image_urls: [
            '/assets/hompage3.jpg',
            '/assets/hompage4.jpg'
          ],
          category: 'Healthcare',
          location: 'Jamia Nagar & Okhla, Delhi',
          status: 'Active & Ongoing',
        },
        {
          title: 'Nutritious Meal & Food Relief Drives',
          description: 'Regular dry ration kits and cooked food distribution drives for daily wage workers, homeless, and vulnerable families.',
          image_urls: [
            '/assets/hompage5.jpg',
            '/assets/hompage1.jpg'
          ],
          category: 'Nutrition',
          location: 'Delhi NCR',
          status: 'Active & Ongoing',
        }
      ]);
    }

    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.create([
        {
          title: 'Winter Sweater & Warm Clothes Distribution',
          description: 'A dedicated winter relief campaign providing high quality sweaters, thermals, and blankets to children in need.',
          image_urls: [
            '/assets/hompage2.jpg',
            '/assets/hompage4.jpg'
          ],
          category: 'Welfare Project',
          location: 'Delhi',
          status: 'In Progress',
        },
        {
          title: 'Vidyanjali Government School Outreach',
          description: 'Collaborating with community schools to support teaching infrastructure, stationery kits, and digital literacy.',
          image_urls: [
            '/assets/hompage3.jpg',
            '/assets/hompage5.jpg'
          ],
          category: 'Education Project',
          location: 'New Delhi',
          status: 'In Progress',
        }
      ]);
    }

    const galCount = await Gallery.countDocuments();
    if (galCount === 0) {
      await Gallery.create([
        { title: 'Education Kit Distribution Day', image_url: '/assets/hompage1.jpg', category: 'Education' },
        { title: 'Community Health Awareness Session', image_url: '/assets/hompage3.jpg', category: 'Healthcare' },
        { title: 'Warm Clothes & Sweater Distribution', image_url: '/assets/hompage2.jpg', category: 'Community' },
        { title: 'Food Drive for Underprivileged Families', image_url: '/assets/hompage5.jpg', category: 'Events' },
        { title: 'Annual Volunteers Meet', image_url: '/assets/hompage4.jpg', category: 'Events' },
      ]);
    }

    const docCount = await Document.countDocuments();
    if (docCount === 0) {
      await Document.create([
        {
          title: 'Spread Smiles Trust Registration Certificate',
          description: 'Official Government registered NGO trust deed and certificate of registration.',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          category: 'Certificates',
        },
        {
          title: 'Annual Social Impact Report 2024-2025',
          description: 'Comprehensive report highlighting our initiatives, lives impacted, and financial transparency.',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          category: 'Reports',
        }
      ]);
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        email: 'admin@spreadsmiles.org',
        password: hashedPassword,
        role: 'superadmin',
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
