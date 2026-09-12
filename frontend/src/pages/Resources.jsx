import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, BookOpen } from 'lucide-react';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';

export default function Resources() {
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [category, search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = '/resources?status=available';
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      setResources(res.data);
    } catch (e) {
      console.error('Fetch resources error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Campus Resource Marketplace</h1>
          <p className="text-slate-600 text-sm mt-1">Discover textbooks, calculators, lab kits, and tools available from peers.</p>
        </div>
        <Link
          to="/resources/create"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Share Resource
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title, subject..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-2 px-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="">All Categories</option>
            <option value="calculator">Calculators</option>
            <option value="textbook">Textbooks</option>
            <option value="lab_kit">Lab Kits</option>
            <option value="component">Electronic Components</option>
            <option value="tools">Tools & Hardware</option>
            <option value="notes">Notes & Materials</option>
          </select>
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading catalog from MongoDB...</div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No resources found</h3>
          <p className="text-xs text-slate-500 mb-4">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map(res => (
            <ResourceCard key={res._id} resource={res} />
          ))}
        </div>
      )}

    </div>
  );
}
