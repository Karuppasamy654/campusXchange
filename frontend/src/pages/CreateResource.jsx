import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, MapPin } from 'lucide-react';
import api from '../services/api';

export default function CreateResource() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'calculator',
    description: '',
    condition: 'good',
    mode: 'lend',
    price: 0,
    campusZone: 'CEG Library Zone',
    latitude: 13.0102,
    longitude: 80.2354,
    tags: 'calculator, math'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsList = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/resources', {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        condition: formData.condition,
        mode: formData.mode,
        price: Number(formData.price),
        tags: tagsList,
        location: {
          campusZone: formData.campusZone,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude)
        }
      });

      navigate('/resources');
    } catch (err) {
      setError(err.response?.data?.detail?.message || 'Failed to list resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Cancel
      </button>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">List Resource on CampusXchange</h1>
          <p className="text-xs text-slate-500 mt-1">Saves document in MongoDB, builds PostGIS spatial coordinates, and attaches temporal history.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Casio FX-991EX Scientific Calculator"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option value="calculator">Scientific Calculator</option>
                <option value="textbook">Textbook / Book</option>
                <option value="lab_kit">Lab Kit / Uniform</option>
                <option value="component">Electronic Component</option>
                <option value="tools">Tools & Equipment</option>
                <option value="notes">Notes / Project Ref</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lending / Selling Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option value="lend">Lend (Free Borrow)</option>
                <option value="sell">Sell</option>
                <option value="donate">Donate</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white"
              >
                <option value="new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="worn">Worn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe condition, course relevance, battery level..."
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campus Pickup Zone (PostGIS Spatial Pin)</label>
            <input
              type="text"
              value={formData.campusZone}
              onChange={(e) => setFormData({ ...formData, campusZone: e.target.value })}
              placeholder="e.g. CEG Library Zone / Science Block"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? 'Publishing...' : <><PlusCircle className="w-4 h-4" /> Publish Resource Listing</>}
          </button>
        </form>
      </div>
    </div>
  );
}
