import React from 'react';
import { Database, Shield, Cpu, MapPin, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800/80 relative overflow-hidden">
      {/* Pink/Purple Glow ambient backdrop */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-pink-500/10 to-purple-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          <div>
            <Logo variant="footer" className="mb-4" />
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              Academic resource-sharing platform demonstrating real multi-database implementation of MongoDB, Neo4j Graph, PostgreSQL System-Versioned Temporal Tables, PostGIS Spatial Indexing, and Active ECA Triggers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" /> Database Engines
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-center gap-2 text-emerald-400"><Database className="w-4 h-4" /> MongoDB (Primary Document NoSQL)</li>
              <li className="flex items-center gap-2 text-cyan-400"><Cpu className="w-4 h-4" /> Neo4j (Cypher Graph DB)</li>
              <li className="flex items-center gap-2 text-purple-400"><Shield className="w-4 h-4" /> PostgreSQL (System-Versioned Temporal)</li>
              <li className="flex items-center gap-2 text-pink-400"><MapPin className="w-4 h-4" /> PostGIS (Spatial Indexing)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">Academic Features</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li className="hover:text-pink-400 transition-colors">• Textbooks & Lab Kits</li>
              <li className="hover:text-cyan-400 transition-colors">• Notes & Question Papers</li>
              <li className="hover:text-purple-400 transition-colors">• Multi-hop Graph Recommendations</li>
              <li className="hover:text-amber-400 transition-colors">• Temporal Point-in-Time History</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">Project Specialization</h4>
            <p className="text-xs text-slate-400 mb-3">Advanced Database Architecture</p>
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 text-pink-300 border border-pink-500/40 rounded-xl text-xs font-mono font-bold shadow-lg shadow-pink-500/10">
              FastAPI + React + 5 Multi-DBs
            </span>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium">
          © 2026 CampusXchange. Built for Advanced Database Learning & Faculty Viva Demonstration.
        </div>
      </div>
    </footer>
  );
}
