import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, MapPin, User, ArrowRight } from 'lucide-react';

export default function ResourceCard({ resource }) {
  const getBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'calculator': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'textbook': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'lab_kit': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'component': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${getBadgeColor(resource.category)}`}>
            {resource.category}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            {resource.mode || 'lend'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 mb-2">
          {resource.title}
        </h3>

        <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
          {resource.description}
        </p>

        <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.ownerName || 'Student'} ({resource.ownerDepartment || 'CSE'})</span>
          </div>
          {resource.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>{resource.location.campusZone || 'CEG Campus'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 block">Price</span>
          <span className="text-base font-extrabold text-slate-900">
            {resource.price > 0 ? `₹${resource.price}` : 'Free / Share'}
          </span>
        </div>

        <Link
          to={`/resources/${resource._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
