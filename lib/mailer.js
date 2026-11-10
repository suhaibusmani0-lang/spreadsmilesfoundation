import nodemailer from 'nodemailer';

/**
 * Creates Nodemailer transporter using Gmail SMTP
 */
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment variables. Email will be simulated in console.');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send 80G Donation Receipt to Donor via Gmail SMTP
 */
export async function sendDonationReceiptEmail({ to, name, amount, paymentId, orderId, date }) {
  const transporter = getTransporter();
  const subject = '80G Donation Receipt - Spread Smiles Foundation';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; border-bottom: 2px solid #2081e2; padding-bottom: 16px; margin-bottom: 20px;">
        <h1 style="color: #2081e2; margin: 0; font-size: 24px;">Spread Smiles Foundation</h1>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Empowering Lives with Hope & Dignity</p>
      </div>

      <p style="font-size: 16px; color: #1e293b;">Dear <strong>${name}</strong>,</p>
      <p style="color: #475569; line-height: 1.6;">Thank you for your generous contribution of <strong>₹${amount}</strong>. Your support enables us to provide education, healthcare, and nutrition to underprivileged communities.</p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">Donation Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Donor Name:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Amount:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #16a34a;">₹${amount}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Payment ID:</td>
            <td style="padding: 6px 0; font-family: monospace; color: #0f172a;">${paymentId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Order ID:</td>
            <td style="padding: 6px 0; font-family: monospace; color: #0f172a;">${orderId || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Date:</td>
            <td style="padding: 6px 0; color: #0f172a;">${date || new Date().toLocaleDateString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <p style="color: #64748b; font-size: 13px;">Spread Smiles Foundation is a registered non-profit organization. Donations may be eligible for tax exemption under 80G as per applicable IT laws.</p>
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
        <p>Spread Smiles Foundation | F 235/3, Shaheen Bagh, Jamia Nagar, New Delhi 110025</p>
        <p>Email: spreadsmilesfoundation8@gmail.com | Phone: +91 7840008043</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[SIMULATED EMAIL via Gmail SMTP] To: ${to}, Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  return transporter.sendMail({
    from: `"Spread Smiles Foundation" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

/**
 * Send Contact Form notification to Foundation Admin via Gmail SMTP
 */
export async function sendContactNotification({ name, email, phone, subject, message }) {
  const transporter = getTransporter();
  const recipient = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'spreadsmilesfoundation8@gmail.com';
  const mailSubject = `New Contact Form Query: ${subject}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #2081e2;">New Message Received via Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;"/>
      <p><strong>Message:</strong></p>
      <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message}</div>
    </div>
  `;

  if (!transporter) {
    console.log(`[SIMULATED EMAIL via Gmail SMTP] Contact query from: ${name} (${email}) - ${subject}`);
    return { success: true, simulated: true };
  }

  return transporter.sendMail({
    from: `"Spread Smiles Website" <${process.env.GMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: mailSubject,
    html,
  });
}

/**
 * Send Volunteer Registration notification to Foundation Admin via Gmail SMTP
 */
export async function sendVolunteerNotification({ name, email, phone, city, message }) {
  const transporter = getTransporter();
  const recipient = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'spreadsmilesfoundation8@gmail.com';
  const mailSubject = `New Volunteer Registration: ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #16a34a;">New Volunteer Registration</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>City:</strong> ${city || 'N/A'}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;"/>
      <p><strong>Availability / Notes:</strong></p>
      <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message}</div>
    </div>
  `;

  if (!transporter) {
    console.log(`[SIMULATED EMAIL via Gmail SMTP] Volunteer registered: ${name} (${email})`);
    return { success: true, simulated: true };
  }

  return transporter.sendMail({
    from: `"Spread Smiles Website" <${process.env.GMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: mailSubject,
    html,
  });
}
