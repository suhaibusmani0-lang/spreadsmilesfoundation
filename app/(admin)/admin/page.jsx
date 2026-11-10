'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Briefcase,
  Heart,
  LogOut,
  Plus,
  Loader2,
  Trash2,
  Edit,
  X,
  Search,
  Activity,
  FileText,
  UploadCloud,
  ChevronRight,
  IndianRupee,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');
  const [authChecked, setAuthChecked] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Reports');
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Pro Features States
  const [itemsList, setItemsList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    projects: 0,
    programs: 0,
    gallery: 0,
    documents: 0,
    totalDonations: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Check admin session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        setAuthChecked(true);
      } catch (err) {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (authChecked) {
      fetchItems();
      fetchStats();
      resetForm();
      setSearchQuery('');
    }
  }, [activeTab, authChecked]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats Error:', error);
    }
  };

  const fetchItems = async () => {
    setFetching(true);
    try {
      if (activeTab === 'donations') {
        const response = await fetch('/api/donations');
        if (!response.ok) throw new Error('Failed to fetch donations');
        const data = await response.json();
        setDonationsList(Array.isArray(data) ? data : []);
      } else {
        const response = await fetch(`/api/${activeTab}`);
        if (!response.ok) throw new Error(`Failed to fetch ${activeTab}`);
        const data = await response.json();
        setItemsList(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab} data!`);
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Reports');
    setFiles([]);
    setImagePreviews([]);
    setEditingId(null);
    const fileEl = document.getElementById('file-upload');
    if (fileEl) fileEl.value = '';
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (activeTab !== 'documents') {
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (err) {
      router.push('/admin/login');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this permanently?')) return;
    try {
      const res = await fetch(`/api/${activeTab}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Item Deleted Successfully!');
      fetchItems();
      fetchStats();
    } catch (error) {
      toast.error('Error deleting item!');
    }
  };

  const handleEditClick = (item) => {
    const itemId = item.id || item._id;
    setEditingId(itemId);
    setTitle(item.title);
    setDescription(item.description || '');
    if (activeTab === 'documents') setCategory(item.category || 'Reports');
    setFiles([]);
    setImagePreviews([]);
    const fileEl = document.getElementById('file-upload');
    if (fileEl) fileEl.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info('Edit mode active. Make your changes.');
  };

  // Upload helper to Cloudinary via Next.js /api/upload
  const uploadFileToCloudinary = async (file, folder, resourceType = 'auto') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'File upload failed');
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return toast.error('Title is required!');
    if (!editingId && files.length === 0)
      return toast.error(`Please provide a ${activeTab === 'documents' ? 'PDF File' : 'Image'}!`);

    setLoading(true);
    try {
      let finalImageUrls = null;
      let finalSingleFileUrl = null;

      if (files.length > 0) {
        if (activeTab === 'gallery' || activeTab === 'documents') {
          const file = files[0];
          const resourceType = activeTab === 'documents' ? 'raw' : 'image';
          finalSingleFileUrl = await uploadFileToCloudinary(file, `spread_smiles/${activeTab}`, resourceType);
        } else {
          const uploadedUrls = [];
          for (let i = 0; i < files.length; i++) {
            const url = await uploadFileToCloudinary(files[i], `spread_smiles/${activeTab}`, 'image');
            uploadedUrls.push(url);
          }
          finalImageUrls = uploadedUrls;
        }
      }

      const tableData = { title };
      if (activeTab !== 'gallery') tableData.description = description;

      if (activeTab === 'gallery' && finalSingleFileUrl) {
        tableData.image_url = finalSingleFileUrl;
      } else if (activeTab === 'documents') {
        tableData.category = category;
        if (finalSingleFileUrl) tableData.file_url = finalSingleFileUrl;
      } else if (activeTab !== 'gallery' && activeTab !== 'documents' && finalImageUrls) {
        tableData.image_urls = finalImageUrls;
      }

      const url = editingId ? `/api/${activeTab}/${editingId}` : `/api/${activeTab}`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save item');
      }

      toast.success(editingId ? 'Updated Successfully!' : 'Uploaded to Cloudinary & Saved to MongoDB!');
      resetForm();
      fetchItems();
      fetchStats();
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    activeTab === 'donations'
      ? donationsList.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.paymentId?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : itemsList.filter((item) => item.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Premium Sidebar */}
      <div className="w-full md:w-72 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl z-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>

        <div className="p-8 text-center border-b border-slate-800/80 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 mb-4 shadow-lg shadow-indigo-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            ADMIN
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              PRO
            </span>
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">Spread Smiles</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-6 relative z-10">
          {[
            { id: 'projects', label: 'Projects', icon: Briefcase, count: stats.projects },
            { id: 'programs', label: 'Programs', icon: Heart, count: stats.programs },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: stats.gallery },
            { id: 'documents', label: 'Documents', icon: FileText, count: stats.documents },
            { id: 'donations', label: 'Donations', icon: CreditCard, count: `₹${stats.totalDonations}` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${
                  isActive ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  <span>{tab.label}</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 relative z-10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">
              Manage {activeTab}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Cloudinary for Media Storage &bull; MongoDB for Realtime Data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold border border-green-200">
              MongoDB Connected
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-200">
              Cloudinary Active
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Not shown on donations tab */}
          {activeTab !== 'donations' && (
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                {editingId ? <Edit size={20} className="text-indigo-600" /> : <Plus size={20} className="text-indigo-600" />}
                {editingId ? 'Edit Entry' : `Add New ${activeTab.slice(0, -1)}`}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {activeTab !== 'gallery' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Write detailed description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Reports">Reports</option>
                      <option value="Certificates">Certificates</option>
                      <option value="Policies">Policies</option>
                    </select>
                  </div>
                )}

                {/* File Upload to Cloudinary */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    {activeTab === 'documents' ? 'Upload PDF Document' : 'Upload Images (Cloudinary)'}
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50/50 relative">
                    <input
                      type="file"
                      id="file-upload"
                      multiple={activeTab !== 'gallery' && activeTab !== 'documents'}
                      accept={activeTab === 'documents' ? 'application/pdf' : 'image/*'}
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">
                      {files.length > 0
                        ? `${files.length} file(s) selected`
                        : activeTab === 'documents'
                        ? 'Click or drag PDF to upload'
                        : 'Click or drag Images to upload'}
                    </p>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {imagePreviews.map((preview, i) => (
                        <img
                          key={i}
                          src={preview}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : editingId ? (
                      'Update Item'
                    ) : (
                      'Upload & Publish'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Right Section: Data List */}
          <div className={activeTab === 'donations' ? 'lg:col-span-12' : 'lg:col-span-7'}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-bold text-slate-900 text-lg">Existing Records ({filteredItems.length})</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title, name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {fetching ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">No records found.</div>
              ) : activeTab === 'donations' ? (
                /* DONATIONS TABLE */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                        <th className="pb-3 font-semibold">Donor Name</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Purpose</th>
                        <th className="pb-3 font-semibold">Payment ID</th>
                        <th className="pb-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredItems.map((d) => (
                        <tr key={d.id || d._id} className="hover:bg-slate-50/50">
                          <td className="py-4 font-bold text-slate-900">{d.name}</td>
                          <td className="py-4 text-xs text-slate-500">{d.email}</td>
                          <td className="py-4 font-bold text-green-600">₹{d.amount}</td>
                          <td className="py-4 text-xs">{d.purpose || 'General'}</td>
                          <td className="py-4 font-mono text-xs text-slate-500">{d.paymentId || 'N/A'}</td>
                          <td className="py-4 text-xs text-slate-400">
                            {d.date ? new Date(d.date).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* REGULAR ITEMS LIST */
                <div className="space-y-4">
                  {filteredItems.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-all gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {activeTab === 'gallery' ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                            />
                          ) : activeTab === 'documents' ? (
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                              <FileText size={24} />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                              {item.image_urls && item.image_urls.length > 0 ? (
                                <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                  No Img
                                </div>
                              )}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                            {item.description && (
                              <p className="text-xs text-slate-500 truncate">{item.description}</p>
                            )}
                            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                              {item.category || (activeTab === 'documents' ? 'Reports' : 'General')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(itemId)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
