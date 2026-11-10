'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';

const GalleryView = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Education', 'Healthcare', 'Community', 'Events'];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      let res = await fetch('/api/gallery');
      let data = await res.json();

      if (Array.isArray(data) && data.length === 0) {
        await fetch('/api/seed');
        res = await fetch('/api/gallery');
        data = await res.json();
      }

      setGalleryItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    activeFilter === 'All'
      ? galleryItems
      : galleryItems.filter(
          (item) =>
            (item.category && item.category.toLowerCase().includes(activeFilter.toLowerCase())) ||
            (item.title && item.title.toLowerCase().includes(activeFilter.toLowerCase()))
        );

  return (
    <div className="bg-gradient-to-b from-blue-50/50 to-white min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-[#2081e2] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
            Spread Smiles Foundation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#2081e2]">Gallery</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl mx-auto">
            Witness the impact of our work through these moments captured during our various initiatives and community
            programs.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeFilter === filter
                  ? 'bg-[#2081e2] text-white border-[#2081e2] shadow-md'
                  : 'bg-white text-[#2081e2] border-blue-200 hover:bg-blue-50'
              }`}
            >
              {filter === 'All' && <Filter className="w-4 h-4" />}
              {filter}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#2081e2] animate-spin" />
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
            No photos uploaded yet. Add some moments from the Admin Panel!
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item) => (
              <div
                key={item.id || item._id}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-full relative">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery Item'}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && galleryItems.length > 0 && filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
            No photos found for <span className="font-bold">&quot;{activeFilter}&quot;</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;
