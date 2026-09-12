import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, Clock, Bell, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import ResourceCard from '../components/ResourceCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myResources, setMyResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resData, reqData, notifData] = await Promise.all([
        api.get('/resources?ownerId=me'),
        api.get('/requests?role=all'),
        api.get('/notifications')
      ]);
      setMyResources(resData.data);
      setRequests(reqData.data);
      setNotifications(notifData.data);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      await api.post(`/requests/${reqId}/accept`);
      fetchDashboardData();
    } catch (e) {
      alert("Error accepting request: " + (e.response?.data?.detail?.message || e.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-md flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl border-2 border-indigo-400">
            {user?.name?.[0] || 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{user?.name || 'Student Dashboard'}</h1>
            <p className="text-sm text-indigo-200">
              {user?.department} • Semester {user?.semester}
            </p>
            <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40">
              ROLE: {user?.role || 'STUDENT'}
            </span>
          </div>
        </div>

        <Link
          to="/resources/create"
          className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-sm transition flex items-center gap-2 shadow-lg"
        >
          <PlusCircle className="w-4 h-4" /> Share New Resource
        </Link>
      </div>

      {/* Grid: My Resources & Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: My Listed Resources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> My Listed Resources ({myResources.length})
            </h2>
            <Link to="/resources/create" className="text-xs font-bold text-indigo-600 hover:underline">
              + Add Resource
            </Link>
          </div>

          {myResources.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p className="text-sm text-slate-500 mb-4">You have not listed any resources yet.</p>
              <Link to="/resources/create" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Share First Resource
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myResources.map(r => (
                <ResourceCard key={r._id} resource={r} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column: Borrowing Requests & Notifications */}
        <div className="space-y-6">
          
          {/* Requests Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Borrowing Requests ({requests.length})
            </h3>

            {requests.length === 0 ? (
              <p className="text-xs text-slate-400">No active borrowing requests.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {requests.map(req => (
                  <div key={req._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{req.resourceTitle}</span>
                      <span className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-500">From: {req.requesterName}</p>
                    {req.status === 'pending' && req.ownerId === user?._id && (
                      <button
                        onClick={() => handleAcceptRequest(req._id)}
                        className="mt-2 w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px]"
                      >
                        Accept Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Persistent Database Notifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" /> Database Notifications
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400">No notifications yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n._id} className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-indigo-900">{n.title}</p>
                    <p className="text-slate-600">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
