import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Database, Shield, MapPin, Cpu, ArrowRight, Layers, Flame, Zap } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../services/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleAISearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/resources?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 pb-20 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Hero Section with Official Animated Transparent Logo Banner */}
      <section className="relative overflow-hidden pt-8 pb-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
        
        {/* Dynamic Multi-Color Background Glow Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-[130px] pointer-events-none animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Logo Hero Component */}
          <div className="mb-12">
            <Logo variant="hero" theme="dark" showFeatures={true} className="shadow-[0_25px_70px_rgba(236,72,153,0.2)]" />
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Specialization Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 text-pink-300 text-xs sm:text-sm font-extrabold mb-6 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-md animate-float">
              <Zap className="w-4 h-4 text-pink-400 animate-bounce" />
              <span>Next-Gen Academic Resource Exchange Platform</span>
            </div>

            <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Share Resources, Exchange Knowledge Across <span className="gradient-heading">Campus</span>
            </h2>

            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Borrow scientific calculators, lab equipment, textbooks, notes, and previous year question papers. Powered by real-time MongoDB NoSQL documents, Neo4j multi-hop graph queries, PostGIS spatial indexing, and PostgreSQL system-versioned temporal audit tables.
            </p>

            {/* Glowing AI Search Box */}
            <form onSubmit={handleAISearch} className="max-w-3xl mx-auto mb-10">
              <div className="relative flex items-center bg-slate-900/90 p-2.5 rounded-2xl shadow-[0_10px_35px_rgba(236,72,153,0.3)] border-2 border-pink-500/40 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300">
                <div className="pl-3 pr-2 text-pink-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask Gemini AI in natural language e.g. 'Scientific calculator for CSE lab near Anna Univ'..."
                  className="w-full text-sm sm:text-base text-white focus:outline-none py-2 bg-transparent placeholder-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3 btn-pink-gradient font-extrabold text-sm sm:text-base rounded-xl transition flex items-center gap-2 shadow-lg hover:scale-105"
                >
                  <Search className="w-5 h-5" /> Search
                </button>
              </div>
              <div className="text-left mt-2.5 pl-4 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> AI parses intent into spatial ST_DWithin radius searches and Neo4j graph recommendations.
              </div>
            </form>

            {/* Quick CTA Buttons with Vibrant Colors */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link
                to="/resources"
                className="px-8 py-4 rounded-2xl btn-pink-gradient font-black text-base hover:scale-105 transition-all shadow-[0_10px_30px_rgba(236,72,153,0.4)] flex items-center gap-2"
              >
                Browse All Resources <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/database-lab"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-2 border-amber-500/50 font-black text-base hover:bg-amber-500/30 hover:scale-105 transition-all flex items-center gap-2 shadow.lg shadow-amber-500/20"
              >
                <Database className="w-5 h-5 text-amber-400 animate-spin-slow" /> Interactive Database Lab
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5 Specialized Database Engines Cards (Each with Unique Vibrant Colors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-14">
          <span className="px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-widest inline-block mb-3">
            Multi-Database Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">5 Specialized Database Engines</h2>
          <p className="text-slate-400 text-base mt-3 max-w-2xl mx-auto">
            Every database engine powers its exact domain specialty with zero mock data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          
          {/* Engine 1: MongoDB (Emerald Green) */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 rounded-3xl border border-emerald-500/40 hover:border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.15)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.3)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/40">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white mb-2 text-lg group-hover:text-emerald-400 transition-colors">MongoDB NoSQL</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Primary document store managing flexible resource metadata, user profiles, notes, and reviews.</p>
          </div>

          {/* Engine 2: Neo4j Graph (Neon Cyan) */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 rounded-3xl border border-cyan-500/40 hover:border-cyan-400 shadow-[0_10px_25px_rgba(6,182,212,0.15)] hover:shadow-[0_15px_35px_rgba(6,182,212,0.3)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/40">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white mb-2 text-lg group-hover:text-cyan-400 transition-colors">Neo4j Graph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Multi-hop Cypher queries traversing student project relationships and subject interest graphs.</p>
          </div>

          {/* Engine 3: PostgreSQL Temporal (Electric Purple) */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 rounded-3xl border border-purple-500/40 hover:border-purple-400 shadow-[0_10px_25px_rgba(168,85,247,0.15)] hover:shadow-[0_15px_35px_rgba(168,85,247,0.3)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/40">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white mb-2 text-lg group-hover:text-purple-400 transition-colors">System Temporal DB</h3>
            <p className="text-xs text-slate-400 leading-relaxed">PostgreSQL system-versioned history tracking point-in-time ownership and price changes.</p>
          </div>

          {/* Engine 4: PostGIS Spatial (Vibrant Pink/Rose) */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 rounded-3xl border border-pink-500/40 hover:border-pink-400 shadow-[0_10px_25px_rgba(236,72,153,0.15)] hover:shadow-[0_15px_35px_rgba(236,72,153,0.3)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center mb-5 group-hover:bounce transition-transform shadow-lg shadow-pink-500/40">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white mb-2 text-lg group-hover:text-pink-400 transition-colors">PostGIS Spatial</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Spatial GIST indexing executing ST_DWithin and ST_Distance radius searches across campuses.</p>
          </div>

          {/* Engine 5: Active ECA Triggers (Sunset Orange) */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 rounded-3xl border border-amber-500/40 hover:border-amber-400 shadow-[0_10px_25px_rgba(245,158,11,0.15)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.3)] hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mb-5 group-hover:rotate-180 transition-transform duration-500 shadow-lg shadow-amber-500/40">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white mb-2 text-lg group-hover:text-amber-400 transition-colors">Active DB Triggers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">PL/pgSQL Event-Condition-Action triggers executing automatic notification rules.</p>
          </div>

        </div>
      </section>

    </div>
  );
}
