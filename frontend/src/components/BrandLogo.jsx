import React from 'react';

/**
 * Futuristic Cybernetic AI Agent Logo (CogniX AI Neural Nexus)
 */
export default function BrandLogo({ className = "w-9 h-9" }) {
  return (
    <div className={`relative ${className} shrink-0`}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(34,211,238,0.25)]">
        <defs>
          <linearGradient id="cyberCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="cyberShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <linearGradient id="glowCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="glowAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Cyber Shield */}
        <polygon
          points="50,6 88,28 88,72 50,94 12,72 12,28"
          fill="url(#cyberShield)"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeOpacity="0.45"
        />

        {/* Inner High-Tech Energy Grid */}
        <polygon
          points="50,16 80,33 80,67 50,84 20,67 20,33"
          stroke="url(#cyberCore)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          strokeOpacity="0.75"
        />

        {/* Central Multi-Agent Neural Nexus ('X' Core) */}
        <path
          d="M34 32 L66 68 M66 32 L34 68"
          stroke="url(#cyberCore)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M50 20 L50 40 M50 60 L50 80"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* 4 Autonomous Agent Orbit Nodes */}
        <circle cx="50" cy="18" r="4" fill="url(#glowCyan)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="78" cy="50" r="4" fill="url(#glowAmber)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="50" cy="82" r="4" fill="url(#glowAmber)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="22" cy="50" r="4" fill="url(#glowCyan)" stroke="#ffffff" strokeWidth="1.5" />

        {/* Central Quantum Node */}
        <circle cx="50" cy="50" r="5" fill="#ffffff" />
      </svg>
    </div>
  );
}
