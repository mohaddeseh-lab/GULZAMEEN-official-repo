import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Gold Emblem SVG with Desert Dunes and Geometric Motif */}
      <div className={`relative ${dimensions} flex-shrink-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] via-[#C2593F] to-[#1A100C] p-0.5 shadow-md shadow-[#1A100C]/50`}>
        <div className="w-full h-full bg-[#281C16] rounded-[7px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle desert dune curves */}
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer geometric border */}
            <rect x="6" y="6" width="88" height="88" rx="6" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
            
            {/* Inner diamond star */}
            <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke="#C2593F" strokeWidth="2.5" fill="none" />
            <path d="M50 25 L75 50 L50 75 L25 50 Z" fill="#D4AF37" opacity="0.15" />
            
            {/* Desert dune horizon lines */}
            <path d="M15 68 Q 35 52, 50 62 T 85 55" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 78 Q 40 68, 65 74 T 85 70" stroke="#C2593F" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Central Sun / Starburst dot */}
            <circle cx="50" cy="40" r="6" fill="#D4AF37" />
            <circle cx="50" cy="40" r="3" fill="#281C16" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="font-serif font-bold text-xl sm:text-2xl text-[#F9F4EE] tracking-wide leading-none flex items-center gap-1.5">
          Gulzameen
        </span>
        <span className="text-[10px] sm:text-xs text-[#F9F4EE]/80 tracking-widest uppercase font-sans font-medium mt-0.5">
          Balochistan Cultural Heritage
        </span>
      </div>
    </div>
  );
};
