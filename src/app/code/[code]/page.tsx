'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, LinkIcon, ChartBarIcon, ClockIcon, CalendarIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Link {
  code: string;
  url: string;
  clicks: number;
  lastClicked: Date | null;
  createdAt: Date;
}

export default function StatsPage() {
  const { code } = useParams() as { code: string };
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (code) {
      fetchLink();
    }
  }, [code]);

  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links/${code}`);
      if (res.ok) {
        const data = await res.json();
        setLink(data);
      } else {
        setError('Link not found');
      }
    } catch (err) {
      setError('Failed to load link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <p className="text-gray-600">Loading statistics...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!link) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Dashboard
            </a>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Link Statistics
                </h1>
                <p className="text-gray-600 text-sm">Detailed analytics for your short link</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Short URL Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 glass">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <LinkIcon className="h-7 w-7 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Short URL</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Your shortened link:</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-blue-600 font-mono text-lg break-all">
                    {`${baseUrl}/${link.code}`}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/${link.code}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Original URL:</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all underline"
                >
                  {link.url}
                </a>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 glass"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ChartBarIcon className="h-7 w-7 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {link.clicks}
                </div>
                <p className="text-gray-600">Total Clicks</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Last Clicked</p>
                  <p className="font-medium text-gray-900">
                    {link.lastClicked ? new Date(link.lastClicked).toLocaleDateString() : 'Never'}
                  </p>
                  {link.lastClicked && (
                    <p className="text-xs text-gray-500">
                      {new Date(link.lastClicked).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(link.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 glass"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Link Details</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Code</p>
              <p className="font-mono font-medium text-gray-900">{link.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-gray-900">{new Date(link.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}