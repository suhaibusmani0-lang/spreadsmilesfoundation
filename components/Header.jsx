'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const getDesktopLinkClass = (path) => {
    return pathname === path
      ? 'bg-[#2081e2] text-white px-6 py-2 rounded-full font-semibold text-sm transition-colors'
      : 'text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm transition-colors';
  };

  const getMobileLinkClass = (path) => {
    return pathname === path
      ? 'block font-medium text-[#2081e2] bg-blue-50 px-3 py-2 rounded-md'
      : 'block font-medium text-gray-700 hover:text-[#2081e2] px-3 py-2';
  };

  const isPressActive = pathname?.startsWith('/press') || pathname === '/gallery' || pathname === '/documents';

  return (
    <header className="bg-[#f8f9fc] py-4 px-6 md:px-8 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 1. Logo Section */}
        <Link href="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="Spread Smiles Foundation"
            className="h-14 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-bold text-sm text-[#ea3a72] hidden">Spread Smiles Foundation</span>
        </Link>

        {/* 2. Center Navigation Pill (Desktop) */}
        <nav className="hidden lg:flex items-center bg-white shadow-sm rounded-full px-2 py-1.5">
          <Link href="/" className={getDesktopLinkClass('/')}>
            Home
          </Link>

          <Link href="/about" className={getDesktopLinkClass('/about')}>
            About Us
          </Link>

          <Link href="/programs" className={getDesktopLinkClass('/programs')}>
            Programs
          </Link>

          <Link href="/projects" className={getDesktopLinkClass('/projects')}>
            Projects
          </Link>

          <Link href="/donate" className={getDesktopLinkClass('/donate')}>
            Donate
          </Link>

          <Link href="/contact" className={getDesktopLinkClass('/contact')}>
            Contact
          </Link>

          {/* Dropdown Menu for Press Releases */}
          <div
            className="relative px-2 py-2"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 focus:outline-none transition-colors ${
                isPressActive
                  ? 'bg-[#2081e2] text-white px-6 py-2 rounded-full font-semibold text-sm'
                  : 'text-gray-700 hover:text-[#2081e2] px-4 py-2 font-semibold text-sm'
              }`}
            >
              Press Releases
              <ChevronDown className={`w-4 h-4 ${isPressActive ? 'text-white' : 'text-gray-500'}`} />
            </button>

            {/* Dropdown Items */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden py-2">
                <Link
                  href="/press/news-gallery"
                  className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2081e2]"
                >
                  News Gallery
                </Link>
                <Link
                  href="/press/documents"
                  className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2081e2]"
                >
                  Documents
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* 3. Call to Action Button (Right Side) */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="bg-[#2081e2] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm"
          >
            Join the Movement
          </Link>
        </div>

        {/* Mobile Menu Hamburger Icon */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="lg:hidden text-gray-700 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white text-black p-4 space-y-2 shadow-lg border-t">
          <Link href="/" className={getMobileLinkClass('/')} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className={getMobileLinkClass('/about')} onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link href="/programs" className={getMobileLinkClass('/programs')} onClick={() => setIsMobileMenuOpen(false)}>
            Programs
          </Link>
          <Link href="/projects" className={getMobileLinkClass('/projects')} onClick={() => setIsMobileMenuOpen(false)}>
            Projects
          </Link>
          <Link href="/donate" className={getMobileLinkClass('/donate')} onClick={() => setIsMobileMenuOpen(false)}>
            Donate
          </Link>
          <Link href="/contact" className={getMobileLinkClass('/contact')} onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>

          <div className="pt-2 pb-1 border-t border-gray-100 mt-2">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Press Releases</p>
            <Link
              href="/press/news-gallery"
              className={getMobileLinkClass('/press/news-gallery')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News Gallery
            </Link>
            <Link
              href="/press/documents"
              className={getMobileLinkClass('/press/documents')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documents
            </Link>
          </div>

          <Link
            href="/contact"
            className="block text-center bg-[#2081e2] text-white py-3 rounded-lg font-bold mt-4 shadow-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Join the Movement
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
