'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Eye, Download, Loader2 } from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const DocumentsView = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);

  const categories = ['All', 'Reports', 'Certificates', 'Policies'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      let res = await fetch('/api/documents');
      let data = await res.json();

      if (Array.isArray(data) && data.length === 0) {
        await fetch('/api/seed');
        res = await fetch('/api/documents');
        data = await res.json();
      }

      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching docs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatermarkDownload = async (fileUrl, title, id) => {
    try {
      setDownloadingId(id);
      toast.info(`Preparing secure download for ${title}...`);

      const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText('SPREAD SMILES FOUNDATION\nNOT FOR UNAUTHORIZED USE', {
          x: width / 4,
          y: height / 2,
          size: 30,
          color: rgb(0.8, 0.1, 0.1),
          opacity: 0.3,
          rotate: degrees(-45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${title}_SpreadSmiles.pdf`);

      toast.success('Downloaded Successfully with Digital Watermark!');
    } catch (error) {
      console.error('Download Error:', error);
      toast.error('Failed to download document securely. Opening file directly...');
      if (fileUrl) {
        window.open(fileUrl, '_blank');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredDocs =
    activeTab === 'All' ? documents : documents.filter((doc) => doc.category === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-[#2081e2] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
            Transparency & Trust
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Official <span className="text-[#2081e2]">Documents</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Access our reports and legal certificates. All downloaded copies are digitally watermarked to prevent
            unauthorized misuse.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeTab === category
                  ? 'bg-[#2081e2] text-white border-[#2081e2] shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-[#2081e2]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#2081e2] animate-spin" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id || doc._id}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-4 bg-blue-50 rounded-xl text-[#2081e2] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-3">
                      <span className="text-[#2081e2] bg-blue-50 px-2 py-0.5 rounded-md">
                        {doc.category || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1">{doc.description}</p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
                  <a
                    href={doc.file_url || doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#2081e2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View Normal
                  </a>

                  <button
                    type="button"
                    onClick={() => handleWatermarkDownload(doc.file_url || doc.fileUrl, doc.title, doc.id || doc._id)}
                    disabled={downloadingId === (doc.id || doc._id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2.5 border border-red-200 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {downloadingId === (doc.id || doc._id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Secure Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsView;
