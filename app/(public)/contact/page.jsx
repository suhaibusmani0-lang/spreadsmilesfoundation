'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  // --- States for Volunteer Form ---
  const [volunteerData, setVolunteerData] = useState({ name: '', email: '', phone: '', city: '', message: '' });
  const [volStatus, setVolStatus] = useState('idle'); // idle, submitting, success, error

  // --- States for Contact Form ---
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle');

  const handleVolChange = (e) => setVolunteerData({ ...volunteerData, [e.target.name]: e.target.value });
  const handleContactChange = (e) => setContactData({ ...contactData, [e.target.name]: e.target.value });

  // 1. Volunteer Form Submit
  const handleVolSubmit = async (e) => {
    e.preventDefault();
    setVolStatus('submitting');
    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerData),
      });

      if (response.ok) {
        setVolStatus('success');
        toast.success('Volunteer registration submitted successfully!');
        setVolunteerData({ name: '', email: '', phone: '', city: '', message: '' });
      } else {
        const err = await response.json();
        toast.error(err.message || 'Registration failed.');
        setVolStatus('error');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      setVolStatus('error');
    }
  };

  // 2. Contact Form Submit
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        setContactStatus('success');
        toast.success('Your message has been sent successfully!');
        setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to send message.');
        setContactStatus('error');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      setContactStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50/30 to-white min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-[#2081e2] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
            Spread Smiles Foundation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-[#2081e2]">Touch</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Reach out to us and join our mission to create positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Contact Details & Volunteer Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#2081e2] w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600 text-sm leading-relaxed uppercase">
                    F 235/3, COMMON SERVICES, SHAHEEN BAGH, ABUL FAZAL ENCLAVE, PART-II, JAMIA NAGAR, NEW DELHI 110025
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <Mail className="text-green-500 w-6 h-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">spreadsmilesfoundation8@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <Phone className="text-yellow-500 w-6 h-6 shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm">+91 7840008043</p>
                </div>
              </div>
            </div>

            {/* VOLUNTEER REGISTRATION FORM */}
            <div id="volunteer-section" className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-gray-100">
              {volStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                  <p className="text-sm text-gray-500 mb-4">Welcome to the team! We will contact you soon.</p>
                  <button
                    type="button"
                    onClick={() => setVolStatus('idle')}
                    className="text-[#2081e2] text-sm font-semibold hover:underline"
                  >
                    Register another volunteer
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Volunteer Registration</h3>
                  <form onSubmit={handleVolSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="name"
                        value={volunteerData.name}
                        onChange={handleVolChange}
                        required
                        placeholder="Full Name"
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm transition-colors"
                      />
                      <input
                        type="email"
                        name="email"
                        value={volunteerData.email}
                        onChange={handleVolChange}
                        required
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm transition-colors"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={volunteerData.phone}
                      onChange={handleVolChange}
                      required
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm transition-colors"
                    />
                    <input
                      type="text"
                      name="city"
                      value={volunteerData.city}
                      onChange={handleVolChange}
                      required
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm transition-colors"
                    />
                    <textarea
                      rows="4"
                      name="message"
                      value={volunteerData.message}
                      onChange={handleVolChange}
                      required
                      placeholder="Tell us about your interest and availability"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm resize-none transition-colors"
                    ></textarea>

                    {volStatus === 'error' && (
                      <p className="text-red-500 text-xs text-center">Registration failed. Try again.</p>
                    )}

                    <button
                      type="submit"
                      disabled={volStatus === 'submitting'}
                      className="w-full bg-[#2081e2] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 shadow-sm"
                    >
                      {volStatus === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                        </>
                      ) : (
                        <>
                          Register as Volunteer <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 h-fit">
            {contactStatus === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  type="button"
                  onClick={() => setContactStatus('idle')}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      name="name"
                      value={contactData.name}
                      onChange={handleContactChange}
                      required
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-green-500 text-sm transition-colors"
                    />
                    <input
                      type="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      required
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-green-500 text-sm transition-colors"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    required
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-green-500 text-sm transition-colors"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={contactData.subject}
                    onChange={handleContactChange}
                    required
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-green-500 text-sm transition-colors"
                  />
                  <textarea
                    rows="7"
                    name="message"
                    value={contactData.message}
                    onChange={handleContactChange}
                    required
                    placeholder="Your Message"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-green-500 text-sm resize-none transition-colors"
                  ></textarea>

                  {contactStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">Failed to send message. Please try again.</p>
                  )}

                  <button
                    type="submit"
                    disabled={contactStatus === 'submitting'}
                    className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 shadow-sm"
                  >
                    {contactStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
