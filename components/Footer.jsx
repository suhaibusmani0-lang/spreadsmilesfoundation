import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Twitter,
  Youtube,
  Lock,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="print:hidden bg-[#2c303a] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Spread Smiles Foundation</h3>
                <p className="text-sm text-gray-400">Est. 2023</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Our mission is to serve humanity by providing education, healthcare, and essential support to
              underprivileged communities.
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.instagram.com/spread.smilesfoundation/"
                target="_blank"
                rel="noreferrer"
                className="bg-[#3a3e49] p-2.5 rounded-lg hover:bg-pink-600 transition-colors text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/spread.smilesfoundation.2025"
                target="_blank"
                rel="noreferrer"
                className="bg-[#3a3e49] p-2.5 rounded-lg hover:bg-blue-600 transition-colors text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://t.me/spreadsmilesfoundation"
                target="_blank"
                rel="noreferrer"
                className="bg-[#3a3e49] p-2.5 rounded-lg hover:bg-sky-500 transition-colors text-white"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=917840008043&text=Welcome%20to%20Spread%20Smiles%20Foundation!"
                target="_blank"
                rel="noreferrer"
                className="bg-[#3a3e49] p-2.5 rounded-lg hover:bg-green-500 transition-colors text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://x.com/smiles_spreads?t=yg_TJk5VwTKK07N4rDCxEQ&s=09"
                target="_blank"
                rel="noreferrer"
                className="bg-[#3a3e49] p-2.5 rounded-lg hover:bg-gray-800 transition-colors text-white"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://youtube.com/@spreadsmilesfoundation?si=4Z7uiaCFUPY1tpST"
                target="_blank"
                rel="noreferrer"
                className="bg-[#3a3e49] p-2.5 rounded-lg hover:bg-red-600 transition-colors text-white"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/programs" className="hover:text-white transition-colors">
                Programs
              </Link>
              <Link href="/projects" className="hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/gallery" className="hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <Link href="/donate" className="hover:text-white transition-colors">
                Donate
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Volunteer
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms and Conditions
              </Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
            <div className="text-sm space-y-3">
              <p className="flex gap-2">
                <MapPin size={18} className="text-gray-400 shrink-0" /> F 235/3, Shaheen Bagh, New Delhi 110025
              </p>
              <p className="flex gap-2">
                <Mail size={18} className="text-gray-400 shrink-0" /> spreadsmilesfoundation8@gmail.com
              </p>
              <p className="flex gap-2">
                <Phone size={18} className="text-gray-400 shrink-0" /> +91 7840008043
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Spread Smiles Foundation. All rights reserved.</p>

          <p>
            Developed by{' '}
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Zarnetic
            </a>
          </p>

          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="flex items-center gap-1 hover:text-white transition-colors">
              <Lock size={12} /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
