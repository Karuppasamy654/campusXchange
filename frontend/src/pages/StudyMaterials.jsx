import React, { useState, useEffect } from 'react';
import { BookOpen, Download, FileText, Filter, Search, PlusCircle } from 'lucide-react';
import api from '../services/api';

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, [category, search]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let url = '/study-materials?';
      if (category) url += `category=${category}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(url);
      setMaterials(res.data);
    } catch (e) {
      console.error("Study materials fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (matId, fileUrl) => {
    try {
      await api.post(`/study-materials/${matId}/download`);
      window.open(fileUrl || '#', '_blank');
      fetchMaterials();
    } catch (e) {
      alert("Download error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Academic Notes & Question Papers</h1>
        <p className="text-slate-600 text-sm mt-1">Access lecture notes, lab manuals, and previous-year question papers uploaded by seniors.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title, subject..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="py-2 px-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-indigo-600"
        >
          <option value="">All Categories</option>
          <option value="notes">Lecture Notes</option>
          <option value="pyq">Previous Year Papers (PYQ)</option>
          <option value="lab_manual">Lab Manuals</option>
          <option value="project_ref">Project References</option>
        </select>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading study materials from MongoDB...</div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No study materials uploaded yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map(m => (
            <div key={m._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {m.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Sem {m.semester} • {m.department}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{m.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{m.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-slate-400" /> {m.downloadCount || 0} downloads
                </span>
                <button
                  onClick={() => handleDownload(m._id, m.fileUrl)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
