'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Target,
  Heart,
  Share2,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const ProjectDetailsPage = () => {
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error('Project not found');
      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#2081e2] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Project Not Found</h2>
        <Link href="/projects" className="bg-[#2081e2] text-white px-6 py-2 rounded-lg font-semibold">
          Go Back
        </Link>
      </div>
    );
  }

  const coverImage =
    project.image_urls && project.image_urls.length > 0
      ? project.image_urls[0]
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <div className="relative h-[350px] md:h-[450px] w-full bg-gray-900">
        <img src={coverImage} alt={project.title} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/40 to-transparent"></div>

        <div className="absolute top-6 left-6 md:left-12 flex justify-between w-[calc(100%-3rem)] md:w-[calc(100%-6rem)]">
          <Link
            href="/projects"
            className="flex items-center gap-2 bg-white/90 text-gray-800 px-4 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-white transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <button
            onClick={handleShare}
            className="bg-white/90 p-2.5 rounded-full text-gray-800 shadow-md hover:bg-white transition-all"
            aria-label="Share"
          >
            <Share2 size={16} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto right-0">
          <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">
            {project.category || 'Community Project'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{project.title}</h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 p-2">
                <div className="bg-blue-50 p-3 rounded-xl text-[#2081e2]">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{project.location || 'Delhi, India'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-x border-gray-100">
                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                  <Target size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Status</p>
                  <p className="text-sm font-bold text-gray-800">{project.status || 'In Progress'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 border-gray-100">
                <div className="bg-pink-50 p-3 rounded-xl text-[#ea3a72]">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Started</p>
                  <p className="text-sm font-bold text-gray-800">
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="text-[#ea3a72]" size={24} /> Project Details
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Gallery */}
            {project.image_urls && project.image_urls.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.image_urls.map((img, index) => (
                    <div key={index} className="rounded-xl overflow-hidden shadow-sm group aspect-video">
                      <img
                        src={img}
                        alt={`${project.title} - ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:sticky lg:top-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                <DollarSign size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fund this Project</h3>
              <p className="text-sm text-gray-500 mb-6">
                Help us reach our goal faster. Your support makes these projects a reality.
              </p>

              <Link
                href="/donate"
                className="block w-full text-center bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md mb-3"
              >
                Contribute Now
              </Link>

              <Link
                href="/contact"
                className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Partner with Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
