import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Database, MapPin, Sparkles, User, LogOut, PlusCircle, BookOpen } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="hover:opacity-95 transition-opacity">
            <Logo variant="compact" size="md" theme="dark" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2 font-semibold text-sm text-slate-300">
            <Link
              to="/resources"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === '/resources'
                  ? 'text-pink-400 bg-pink-500/15 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  : 'hover:text-pink-400 hover:bg-slate-900'
              }`}
            >
              Resources
            </Link>
            <Link
              to="/study-materials"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === '/study-materials'
                  ? 'text-purple-400 bg-purple-500/15 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'hover:text-purple-400 hover:bg-slate-900'
              }`}
            >
              Notes & PYQs
            </Link>
            <Link
              to="/map"
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                location.pathname === '/map'
                  ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'hover:text-cyan-400 hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-400 animate-pulse" /> PostGIS Map
            </Link>
            
            {/* Database Lab Viva Badge */}
            <Link
              to="/database-lab"
              className="px-4 py-2 rounded-xl text-amber-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300 flex items-center gap-2 font-bold border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <Database className="w-4 h-4 text-amber-400 animate-spin-slow" /> Database Lab Viva
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/resources/create"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl btn-pink-gradient font-bold text-sm shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <PlusCircle className="w-4.5 h-4.5" /> Share Resource
                </Link>
                <Link
                  to="/dashboard"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-pink-400 hover:bg-slate-800 border border-slate-800 transition-all"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-900 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-800 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-pink-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-extrabold btn-pink-gradient rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" /> Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
