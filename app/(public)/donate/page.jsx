'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  IndianRupee,
  ShieldCheck,
  User,
  Mail,
  Sparkles,
  Building,
  Phone,
  MapPin,
  CheckCircle,
  Printer,
  ArrowLeft,
  Target,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

const recentDonors = [
  { name: 'Rahul Sharma', amount: 5000, purpose: 'Education' },
  { name: 'Priya Patel', amount: 2500, purpose: 'Food' },
  { name: 'Vikram Singh', amount: 10000, purpose: 'Health' },
  { name: 'Neha Desai', amount: 1500, purpose: 'Education' },
  { name: 'Aarav Kumar', amount: 3000, purpose: 'Food' },
  { name: 'Anjali Verma', amount: 2000, purpose: 'Health' },
  { name: 'Rohan Gupta', amount: 5000, purpose: 'Education' },
  { name: 'Sneha Reddy', amount: 1100, purpose: 'Food' },
  { name: 'Aditya Jain', amount: 7500, purpose: 'Health' },
  { name: 'Kavita Joshi', amount: 2500, purpose: 'Education' },
  { name: 'Amit Malhotra', amount: 500, purpose: 'Food' },
  { name: 'Pooja Agarwal', amount: 3000, purpose: 'Health' },
  { name: 'Karthik Nair', amount: 10000, purpose: 'Education' },
  { name: 'Meera Iyer', amount: 2000, purpose: 'Food' },
  { name: 'Siddharth Rao', amount: 1500, purpose: 'Health' },
  { name: 'Riya Kapoor', amount: 5000, purpose: 'Education' },
  { name: 'Manish Tiwari', amount: 2500, purpose: 'Food' },
  { name: 'Shweta Singh', amount: 1000, purpose: 'Health' },
  { name: 'Varun Chopra', amount: 4000, purpose: 'Education' },
  { name: 'Nidhi Menon', amount: 1500, purpose: 'Food' },
  { name: 'Sanjay Yadav', amount: 5000, purpose: 'Health' },
  { name: 'Kiran Das', amount: 2100, purpose: 'Education' },
  { name: 'Arjun Bhatia', amount: 3500, purpose: 'Food' },
  { name: 'Swati Mishra', amount: 1000, purpose: 'Health' },
  { name: 'Deepak Chawla', amount: 5000, purpose: 'Education' },
];

const scrollingDonors = [...recentDonors, ...recentDonors];

const DonatePage = () => {
  const [donor, setDonor] = useState({
    name: '',
    email: '',
    amount: '',
    pan: '',
    purpose: 'For Education',
    customPurpose: '',
  });
  const [receiptData, setReceiptData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isPanRequired = Number(donor.amount) >= 2000;

  useEffect(() => {
    if (receiptData) {
      const formattedName = receiptData.name.trim().replace(/\s+/g, '_');
      document.title = `Spread_Smiles_Receipt_${formattedName}`;
    } else {
      document.title = 'Donate | Spread Smiles Foundation';
    }
  }, [receiptData]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(donor.amount) }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TyLgyn9rrDQIKx';

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Spread Smiles Foundation',
        description: 'Donation Contribution',
        order_id: orderData.id,
        handler: async function (paymentResponse) {
          try {
            const verifyCall = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                userDetails: donor,
              }),
            });

            if (verifyCall.ok) {
              setReceiptData({
                ...donor,
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
                date: new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
              });
              setDonor({
                name: '',
                email: '',
                amount: '',
                pan: '',
                purpose: 'For Education',
                customPurpose: '',
              });
              toast.success('Donation successful! Receipt generated.');
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verify error:', err);
            toast.error('Error verifying payment.');
          }
        },
        prefill: { name: donor.name, email: donor.email },
        theme: { color: '#2081e2' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (resp) {
        toast.error('Payment Failed: ' + (resp.error?.description || 'Unknown error'));
      });
      paymentObject.open();
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // =======================================================================
  // 🟢 OFFICIAL 80G RECEIPT VIEW
  // =======================================================================
  if (receiptData) {
    const finalPurpose =
      receiptData.purpose === 'Other' ? receiptData.customPurpose : receiptData.purpose;

    return (
      <div className="min-h-screen bg-slate-100 print:bg-white py-10 px-4 flex justify-center items-start font-sans">
        <div className="max-w-4xl w-full">
          {/* Action Buttons - Hidden in Print */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 print:hidden gap-4">
            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-5 py-2.5 rounded-lg border border-green-100 w-full sm:w-auto justify-center">
              <CheckCircle size={20} /> Payment Successful
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setReceiptData(null)}
                className="flex-1 sm:flex-none justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none justify-center bg-[#2081e2] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Printer size={18} /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Official 80G Receipt Document */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-0 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <img src="/logo.png" alt="watermark" className="w-[500px]" />
            </div>

            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="Spread Smiles" className="h-16 w-auto object-contain" />
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                      Spread Smiles Foundation
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      Registered Non-Profit Trust | Govt. of NCT of Delhi
                    </p>
                    <p className="text-xs text-slate-500">
                      Reg. No: 2023/DEL/TRUST/0420 | 80G & 12A Certified
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right text-xs text-slate-500">
                  <p className="font-bold text-slate-800 text-sm">DONATION RECEIPT</p>
                  <p>Receipt No: SSF-{Date.now().toString().slice(-6)}</p>
                  <p>Date: {receiptData.date}</p>
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">
                  Donor Particulars
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Donor Name:</span>
                    <strong className="text-slate-900 text-base">{receiptData.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Email Address:</span>
                    <span className="text-slate-700">{receiptData.email}</span>
                  </div>
                  {receiptData.pan && (
                    <div>
                      <span className="text-slate-400 block text-xs">PAN Number:</span>
                      <strong className="text-slate-900 tracking-wider uppercase">
                        {receiptData.pan}
                      </strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block text-xs">Purpose:</span>
                    <span className="text-slate-700 font-medium">{finalPurpose}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info Table */}
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase">
                    <th className="p-3.5 rounded-l-lg">Description</th>
                    <th className="p-3.5">Payment Reference</th>
                    <th className="p-3.5 text-right rounded-r-lg">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4">
                      <strong>Voluntary Contribution</strong>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Towards Spread Smiles Charitable Activities
                      </p>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-600">
                      {receiptData.paymentId}
                    </td>
                    <td className="p-4 text-right text-lg font-bold text-green-600">
                      ₹{Number(receiptData.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tax Exemption Note */}
            <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-xs text-slate-600 mb-8 leading-relaxed">
              <p className="font-semibold text-blue-900 mb-1">Tax Exemption Notice:</p>
              Donations to Spread Smiles Foundation are eligible for tax exemption under Section 80G of
              the Income Tax Act, 1961. This computer-generated receipt does not require physical stamp
              or seal.
            </div>

            {/* Footer / Signature */}
            <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-xs text-slate-500">
              <div>
                <p className="font-semibold text-slate-700">Spread Smiles Foundation</p>
                <p>Shaheen Bagh, Jamia Nagar, New Delhi 110025</p>
                <p>Website: www.spreadsmilesfoundation.com</p>
              </div>
              <div className="text-right">
                <div className="font-serif italic font-bold text-slate-800 text-base mb-1">
                  Spread Smiles
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-800">Authorized Signatory</p>
                  <p className="text-[10px]">Spread Smiles Foundation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================================
  // 🟢 REGULAR DONATION FORM & PAGE
  // =======================================================================
  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-[#2081e2] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
            Make an Impact
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Support Our <span className="text-[#2081e2]">Mission</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Your generous contributions bring smiles, educate children, and provide vital healthcare to those in
            need.
          </p>
        </div>

        {/* Live Donors Ticker */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-12 overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            <Sparkles className="w-4 h-4 text-yellow-500" /> Recent Contributors
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {scrollingDonors.slice(0, 15).map((d, i) => (
              <div
                key={i}
                className="shrink-0 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-bold text-slate-800">{d.name}</span>
                <span className="text-green-600 font-semibold">₹{d.amount}</span>
                <span className="text-slate-400">({d.purpose})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Donation Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="text-[#ea3a72] fill-[#ea3a72]" size={24} /> Donation Form
            </h2>

            <form onSubmit={handleDonation} className="space-y-6">
              {/* Preset Amounts */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Amount (₹)</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {[500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonor({ ...donor, amount: amt.toString() })}
                      className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                        donor.amount === amt.toString()
                          ? 'bg-[#2081e2] text-white border-[#2081e2] shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#2081e2] hover:bg-blue-50'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Or enter custom amount"
                    value={donor.amount}
                    onChange={(e) => setDonor({ ...donor, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={donor.name}
                    onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="For 80G receipt"
                    value={donor.email}
                    onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm"
                  />
                </div>
              </div>

              {/* PAN Number (required if amount >= 2000) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  PAN Number {isPanRequired && <span className="text-red-500 font-bold">* (Required for ₹2000+)</span>}
                </label>
                <input
                  type="text"
                  required={isPanRequired}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={donor.pan}
                  onChange={(e) => setDonor({ ...donor, pan: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm uppercase tracking-wider"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Donation Purpose</label>
                <select
                  value={donor.purpose}
                  onChange={(e) => setDonor({ ...donor, purpose: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm bg-white"
                >
                  <option value="For Education">Education for Underprivileged Children</option>
                  <option value="For Healthcare">Healthcare & Medical Relief</option>
                  <option value="For Food">Daily Food & Meal Distribution</option>
                  <option value="Winter Campaign">Winter Sweaters & Blankets</option>
                  <option value="General">Where Needed Most</option>
                  <option value="Other">Other Specific Cause</option>
                </select>
              </div>

              {donor.purpose === 'Other' && (
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Specify the cause"
                    value={donor.customPurpose}
                    onChange={(e) => setDonor({ ...donor, customPurpose: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2081e2] text-sm"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#ea3a72] hover:bg-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-70"
              >
                {isProcessing ? 'Processing Donation...' : `Donate ₹${donor.amount || '0'} Securely`}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <ShieldCheck size={16} className="text-green-600" />
                <span>Protected with 256-bit SSL encryption via Razorpay. Tax exempt under 80G.</span>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Trust & Impact */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="text-[#2081e2]" size={20} /> Transparency First
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  <span>Instant 80G digital receipt</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  <span>100% funds directed to welfare drives</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  <span>Audited annual accounts & impact reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  <span>Verified NGO registration under Delhi Govt.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-tr from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
              <h4 className="font-bold text-lg mb-2">Direct Bank Transfer / UPI</h4>
              <p className="text-xs text-blue-200 mb-4 leading-relaxed">
                Need to transfer directly via NEFT/RTGS or UPI for corporate CSR contributions?
              </p>
              <div className="bg-white/10 p-3 rounded-xl text-xs space-y-1 font-mono">
                <p>Account: Spread Smiles Foundation</p>
                <p>Bank: Available upon request</p>
                <p>UPI ID: Contact Admin</p>
              </div>
              <p className="text-[11px] text-blue-200 mt-3">
                Call us at +91 7840008043 for CSR / 80G partnership documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
