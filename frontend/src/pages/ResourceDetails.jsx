import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield, User, ArrowLeft, Send, History } from 'lucide-react';
import api from '../services/api';

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestMsg, setRequestMsg] = useState('Interested in borrowing this resource for course practice.');
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const [resData, timelineData] = await Promise.all([
        api.get(`/resources/${id}`),
        api.get(`/temporal/resource/${id}/timeline`).catch(() => ({ data: { timeline: [] } }))
      ]);
      setResource(resData.data);
      setTimeline(timelineData.data.timeline || []);
    } catch (e) {
      console.error("Resource fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setRequesting(true);
    try {
      await api.post('/requests', {
        resourceId: id,
        message: requestMsg,
        expectedDurationDays: 7
      });
      setSuccess(true);
    } catch (e) {
      alert(e.response?.data?.detail?.message || 'Failed to submit request.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading resource details...</div>;
  if (!resource) return <div className="text-center py-20 text-rose-600">Resource not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-bold uppercase tracking-wider">
              {resource.category}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{resource.title}</h1>
            <p className="text-xs text-slate-500 mt-1">Listed by {resource.ownerName || 'Student'} ({resource.ownerDepartment || 'CSE'})</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Pricing / Mode</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {resource.price > 0 ? `₹${resource.price}` : 'Free Share'}
            </span>
            <span className="block text-xs font-bold text-emerald-600 uppercase mt-0.5">{resource.mode}</span>
          </div>
        </div>

        <p className="text-slate-700 text-sm leading-relaxed border-t border-b border-slate-100 py-4">
          {resource.description}
        </p>

        {/* Action Button */}
        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold">
            ✅ Borrow request sent to owner! Check updates in your Dashboard.
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase">Request to Borrow Resource</h4>
            <textarea
              rows="2"
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 bg-white"
            />
            <button
              onClick={handleSendRequest}
              disabled={requesting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> {requesting ? 'Sending...' : 'Submit Borrow Request'}
            </button>
          </div>
        )}
      </div>

      {/* Temporal History Timeline (System-Versioned Audit) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">System-Versioned Temporal Audit Trail</h2>
        </div>
        <p className="text-xs text-slate-500">
          Maintained natively in PostgreSQL temporal history tables (`valid_from` to `valid_to` timelines). Anonymized owner lifecycle tracking.
        </p>

        {timeline.length === 0 ? (
          <div className="text-xs text-slate-400 italic">No historical state updates recorded for this item yet.</div>
        ) : (
          <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6 pl-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white" />
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Version #{item.historyId} • Status: {item.status.toUpperCase()}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{item.validFrom} → {item.validTo}</span>
                  </div>
                  <p className="text-slate-600">Price: ₹{item.price} • Condition: {item.condition}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
