'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      let res = await fetch('/api/programs');
      let data = await res.json();

      if (Array.isArray(data) && data.length === 0) {
        // Trigger seed if empty
        await fetch('/api/seed');
        res = await fetch('/api/programs');
        data = await res.json();
      }

      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#2081e2]">Programs</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We run dedicated programs to address the fundamental needs of underprivileged communities.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#2081e2] animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
            No programs uploaded yet. Add some from the Admin Panel!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Link
                key={program.id || program._id}
                href={`/programs/${program.id || program._id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100"
              >
                <div className="h-56 overflow-hidden relative bg-gray-100">
                  {program.image_urls && program.image_urls.length > 0 ? (
                    <img
                      src={program.image_urls[0]}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{program.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">{program.description}</p>
                  <span className="text-[#2081e2] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all w-fit mt-auto">
                    View Details <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;
