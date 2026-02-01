import React from 'react';
import LogoImage from '../assets/img/Norien_Logo_Light.svg';

export const Logo: React.FC = () => {
  return (
    <div className="relative flex items-center cursor-pointer group">
      {/* Glow effect behind logo */}
      <div className="absolute inset-0 opacity-0 blur-2xl rounded-full transition-all duration-500 group-hover:opacity-100 group-hover:scale-150 bg-[#C5A059]" />
      {/* Logo */}
      <img 
        src={LogoImage} 
        alt="Norien Logo" 
        className="relative h-6 w-auto transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]" 
      />
    </div>
  );
};