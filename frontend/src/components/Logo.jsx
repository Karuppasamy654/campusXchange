import React from 'react';

/**
 * CampusXchange High-Energy Animated Logo Component
 * Features vibrant pink/purple/cyan glowing ambient aura, micro-animations,
 * and exact transparent emblem rendering.
 */

export function LogoIcon({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-24 h-24",
    "2xl": "w-36 h-36"
  };

  const appliedSize = className.includes('w-') || className.includes('h-') ? className : `${sizeMap[size] || sizeMap.md} ${className}`;

  return (
    <div className="relative inline-flex items-center justify-center group">
      {/* Background Glow Ring */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse-glow" />
      
      <img
        src="/logo.png"
        alt="CampusXchange Logo Emblem"
        className={`relative z-10 object-contain transition-all duration-300 group-hover:scale-110 filter drop-shadow-xl ${appliedSize}`}
        loading="eager"
      />
    </div>
  );
}

export default function Logo({
  variant = 'compact',
  size = 'md',
  theme = 'light',
  showFeatures = true,
  className = ''
}) {
  const isDark = theme === 'dark';

  // Icon only (Transparent with Glow)
  if (variant === 'icon') {
    return <LogoIcon size={size} className={className} />;
  }

  // Navbar / Compact brand display
  if (variant === 'compact' || variant === 'navbar') {
    return (
      <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
        <LogoIcon size={size} />
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight text-xl sm:text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Campus<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">Xchange</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
            Connect • Share • Grow
          </span>
        </div>
      </div>
    );
  }

  // Footer display
  if (variant === 'footer') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-3">
          <LogoIcon size="md" />
          <span className="font-black text-2xl tracking-tight text-white">
            Campus<span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Xchange</span>
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Connect • Share • Grow
        </p>
      </div>
    );
  }

  // Hero / Full Display (Animated Floating Logo, Vibrant Gradient Badges, Pink/Cyan Glows)
  return (
    <div className={`flex flex-col items-center text-center p-6 sm:p-12 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-pink-500/30 shadow-[0_20px_60px_rgba(236,72,153,0.25)] relative overflow-hidden ${className}`}>
      
      {/* Dynamic Background Multi-Color Ambient Lights */}
      <div className="absolute -top-24 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Extracted Logo Emblem */}
      <div className="relative flex justify-center items-center mb-6 group cursor-pointer">
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
        <LogoIcon size="2xl" className="w-40 h-40 sm:w-52 sm:h-52 relative z-10 animate-float drop-shadow-[0_15px_30px_rgba(236,72,153,0.4)]" />
      </div>

      {/* Main Brand Title with Animated Gradient */}
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-1 mb-2">
        Campus<span className="bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent animate-gradient">Xchange</span>
      </h1>

      {/* Tagline with Multi-Color Dots */}
      <div className="flex items-center justify-center gap-4 text-base sm:text-xl font-extrabold tracking-wider text-slate-200 mt-2 mb-8">
        <span className="hover:text-pink-400 transition-colors">Connect</span>
        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
        <span className="hover:text-purple-400 transition-colors">Share</span>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="hover:text-amber-400 transition-colors">Grow</span>
      </div>

      {/* 5 Distinctly Colored Feature Badges Bar */}
      {showFeatures && (
        <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-5 gap-4 pt-8 border-t border-slate-800/90 relative z-10">
          
          {/* Feature 1: Buy / Sell (Electric Pink) */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-pink-950/40 to-slate-900/80 border border-pink-500/40 hover:border-pink-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(236,72,153,0.2)] group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center mb-2.5 group-hover:rotate-12 transition-transform shadow-lg shadow-pink-500/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xs font-bold text-pink-200 uppercase tracking-wider">Buy / Sell</span>
          </div>

          {/* Feature 2: Exchange (Neon Cyan) */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900/80 border border-cyan-500/40 hover:border-cyan-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(6,182,212,0.2)] group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center mb-2.5 group-hover:rotate-180 transition-transform duration-500 shadow-lg shadow-cyan-500/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Exchange</span>
          </div>

          {/* Feature 3: Borrow / Lend (Vibrant Orange) */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-orange-950/40 to-slate-900/80 border border-orange-500/40 hover:border-orange-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.2)] group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-2.5 group-hover:-translate-y-1 transition-transform shadow-lg shadow-orange-500/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v4.5m0 0V11m0-5.5a1.5 1.5 0 013 0v4.5" />
              </svg>
            </div>
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">Borrow / Lend</span>
          </div>

          {/* Feature 4: Notes & Resources (Emerald Green) */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900/80 border border-emerald-500/40 hover:border-emerald-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)] group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Notes & Resources</span>
          </div>

          {/* Feature 5: Near You (Royal Purple) */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/80 border border-purple-500/40 hover:border-purple-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.2)] group cursor-pointer col-span-2 sm:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2.5 group-hover:bounce transition-transform shadow-lg shadow-purple-500/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Near You</span>
          </div>

        </div>
      )}

    </div>
  );
}
