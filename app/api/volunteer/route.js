import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import { sendVolunteerNotification } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { name, email, phone, city, message } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    let saved = null;
    try {
      await connectToDatabase();
      saved = await Volunteer.create({
        name,
        email,
        phone: phone || '',
        city: city || '',
        message: message || '',
        created_at: new Date(),
      });
    } catch (dbErr) {
      console.warn('MongoDB not reachable for saving volunteer registration:', dbErr.message);
    }

    // Send email notification via Gmail SMTP
    try {
      await sendVolunteerNotification({ name, email, phone, city, message });
    } catch (emailErr) {
      console.warn('⚠️ Gmail SMTP volunteer notification failed:', emailErr.message);
    }

    return NextResponse.json({
      message: 'Volunteer registration sent successfully!',
      data: saved || { name, email, phone, city, message },
    });
  } catch (error) {
    console.error('Volunteer Form Error:', error);
    return NextResponse.json({ message: error.message || 'Failed to submit registration.' }, { status: 500 });
  }
}
