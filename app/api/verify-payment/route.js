import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import Donation from '@/models/Donation';
import { sendDonationReceiptEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userDetails } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Check if demo/test payment
    const isDemo = !key_secret || razorpay_order_id?.startsWith('order_demo_');

    if (!isDemo && key_secret) {
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', key_secret)
        .update(sign.toString())
        .digest('hex');

      if (razorpay_signature !== expectedSign) {
        return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
      }
    }

    const finalPurpose =
      userDetails.purpose === 'Other'
        ? userDetails.customPurpose || 'General'
        : userDetails.purpose || 'For Education';

    const donationData = {
      name: userDetails.name,
      email: userDetails.email,
      amount: Number(userDetails.amount),
      pan: userDetails.pan || '',
      purpose: finalPurpose,
      paymentId: razorpay_payment_id || `pay_manual_${Date.now()}`,
      orderId: razorpay_order_id || `ord_manual_${Date.now()}`,
      status: 'completed',
      date: new Date(),
    };

    let newDonation = donationData;

    try {
      await connectToDatabase();
      newDonation = await Donation.create(donationData);
    } catch (dbErr) {
      console.warn('MongoDB not reachable for saving donation record:', dbErr.message);
    }

    // Send Thank you email via Gmail SMTP
    try {
      await sendDonationReceiptEmail({
        to: userDetails.email,
        name: userDetails.name,
        amount: userDetails.amount,
        paymentId: donationData.paymentId,
        orderId: donationData.orderId,
        date: new Date().toLocaleDateString('en-IN'),
      });
    } catch (emailErr) {
      console.warn('⚠️ Failed to send receipt email via Gmail SMTP:', emailErr.message);
    }

    return NextResponse.json({
      message: 'Payment verified and donation recorded successfully',
      donation: newDonation,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ message: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
