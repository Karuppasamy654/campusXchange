import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Layers } from 'lucide-react';
import api from '../services/api';

export default function MapPage() {
  const [radius, setRadius] = useState(1000);
  const [nearbyResources, setNearbyResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sqlExplanation, setSqlExplanation] = useState('');

  // Default campus coordinates (CEG Campus, Anna University)
  const lat = 13.0102;
  const lng = 80.2354;

  useEffect(() => {
    fetchNearby();
  }, [radius]);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/spatial/nearby?latitude=${lat}&longitude=${lng}&radiusMeters=${radius}`);
      setNearbyResources(res.data.results || []);
      setSqlExplanation(res.data.sqlQuery || '');
    } catch (e) {
      console.error("Spatial fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold mb-2">
          <MapPin className="w-4 h-4 text-rose-600" /> PostgreSQL + PostGIS Spatial Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Interactive Campus Spatial Map</h1>
        <p className="text-slate-600 text-sm mt-1">Discover physical resources located near your building using PostGIS ST_DWithin & ST_Distance queries with GIST indexing.</p>
      </div>

      {/* Control Panel & Radius Slider */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Radius Range Filter: <span className="text-indigo-600 text-sm font-extrabold">{radius} meters</span>
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-800 block mb-1">Current Coordinates</span>
          <span className="font-mono text-slate-600">Lat: {lat} N • Long: {lng} E</span>
          <span className="block text-[11px] text-teal-600 font-semibold mt-1">CEG Campus Library Zone</span>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-indigo-600 block">{nearbyResources.length}</span>
          <span className="text-xs text-slate-500 font-bold uppercase">Resources Found in Range</span>
        </div>
      </div>

      {/* SQL Query Inspector */}
      {sqlExplanation && (
        <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs shadow-inner overflow-x-auto">
          <span className="text-slate-400 block mb-1 font-sans text-[11px] uppercase font-bold">Executed PostGIS SQL:</span>
          {sqlExplanation}
        </div>
      )}

      {/* Nearby Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyResources.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                {item.category}
              </span>
              <span className="text-xs font-extrabold text-indigo-600 font-mono">
                {item.distanceMeters}m away
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> {item.campusZone}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
