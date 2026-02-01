import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (view: 'landing' | 'wip') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#03061C]">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div 
          className="opacity-80 scale-75 origin-left cursor-pointer hover:opacity-100 transition-opacity"
          onClick={() => onNavigate('landing')}
        >
            <Logo />
        </div>
        <div className="text-norien-silver text-sm">
            &copy; {new Date().getFullYear()} Norien Automation. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-norien-silver">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('wip'); }}
              className="hover:text-norien-gold transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('wip'); }}
              className="hover:text-norien-gold transition-colors"
            >
              Terms
            </a>
        </div>
      </div>
    </footer>
  );
};