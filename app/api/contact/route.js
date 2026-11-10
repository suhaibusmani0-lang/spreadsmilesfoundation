import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { sendContactNotification } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Name, email and message are required' }, { status: 400 });
    }

    let saved = null;
    try {
      await connectToDatabase();
      saved = await ContactMessage.create({
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Query',
        message,
        created_at: new Date(),
      });
    } catch (dbErr) {
      console.warn('MongoDB not reachable for saving contact message:', dbErr.message);
    }

    // Send email notification via Gmail SMTP
    try {
      await sendContactNotification({ name, email, phone, subject, message });
    } catch (emailErr) {
      console.warn('⚠️ Gmail SMTP sending notification failed:', emailErr.message);
    }

    return NextResponse.json({
      message: 'Contact message sent successfully!',
      data: saved || { name, email, subject, message },
    });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ message: error.message || 'Failed to send message.' }, { status: 500 });
  }
}
