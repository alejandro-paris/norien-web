import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-1 tracking-widest font-bold text-2xl select-none">
      <span>N</span>
      <span>
        <div className="relative w-6 h-6 flex items-center justify-center">
            {/* The O circle */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                <path d="M50,10 A40,40 0 1,0 50,90 A40,40 0 1,0 50,10 Z M50,20 A30,30 0 1,1 50,80 A30,30 0 1,1 50,20 Z" />
            </svg>
            {/* The Compass Needle */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 animate-pulse-slow">
                     <path d="M50,15 L60,50 L50,85 L40,50 Z" className="fill-norien-gold" />
                </svg>
            </div>
        </div>
      </span>
      <span>RIEN</span>
    </div>
  );
};