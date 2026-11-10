'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tocItems = [
    { id: 'donations', title: '1. Donations' },
    { id: 'use-of-website', title: '2. Use of Website' },
    { id: 'payment-processing', title: '3. Payment Processing' },
    { id: 'intellectual-property', title: '4. Intellectual Property' },
    { id: 'limitation-of-liability', title: '5. Limitation of Liability' },
    { id: 'amendments', title: '6. Amendments' },
    { id: 'contact-us', title: '7. Contact Us' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 60 }}
        className="max-w-5xl mx-auto bg-white p-8 md:p-12 shadow-xl rounded-xl border border-gray-100"
      >
        <div className="text-center mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Spread Smiles Foundation
          </p>
          <p className="text-sm text-gray-400">Last updated: 27/05/2026</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/3 shrink-0">
            <div className="sticky top-24 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-red-600 pb-2 inline-block">
                Contents
              </h2>
              <ul className="space-y-3 text-sm font-medium text-gray-600">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className="hover:text-red-600 hover:underline cursor-pointer"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-8 text-gray-700 leading-relaxed">
            <p>
              Welcome to <strong>Spread Smiles Foundation</strong>. By accessing our website and making a donation, you agree to the following terms and conditions.
            </p>

            <section id="donations" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. Donations</h2>
              <p>
                All donations made through our platform are voluntary and non-refundable, unless explicitly stated otherwise. Donations will be used for the welfare and charitable purposes as described by the organization.
              </p>
            </section>

            <section id="use-of-website" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. Use of Website</h2>
              <p>
                You agree not to misuse this website by attempting unauthorized access, transmitting harmful content, or violating applicable laws and regulations.
              </p>
            </section>

            <section id="payment-processing" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. Payment Processing</h2>
              <p>
                We use secure third-party payment providers such as Razorpay to process donations. By making a payment, you agree to Razorpay’s terms and privacy policies.
              </p>
            </section>

            <section id="intellectual-property" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. Intellectual Property</h2>
              <p>
                All content on this website, including logos, text, images, and designs, are the property of Spread Smiles Foundation and may not be used without prior written consent.
              </p>
            </section>

            <section id="limitation-of-liability" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Limitation of Liability</h2>
              <p>
                We are not liable for any direct, indirect, or incidental damages arising from your use of this website or donation process.
              </p>
            </section>

            <section id="amendments" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">6. Amendments</h2>
              <p>
                We reserve the right to update or change these Terms & Conditions at any time. Changes will be posted on this page with the updated date.
              </p>
            </section>

            <section id="contact-us" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-900 mb-2">7. Contact Us</h2>
              <p>
                For any queries regarding these Terms & Conditions, please contact us at:{' '}
                <a href="mailto:spreadsmilesfoundation8@gmail.com" className="text-red-600 underline">
                  spreadsmilesfoundation8@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
