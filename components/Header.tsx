import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Mail } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'landing' | 'wip') => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-norien-bg/80 backdrop-blur-md border-white/5 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('landing')} 
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo />
        </div>
        <nav>
            <Button 
              variant="outline" 
              className="hidden md:flex !py-2 !px-5 text-sm"
              onClick={() => onNavigate('wip')}
            >
                <Mail size={16} />
                <span>Contacto</span>
            </Button>
            {/* Mobile Icon Placeholder */}
            <button 
              className="md:hidden text-norien-gold p-2"
              onClick={() => onNavigate('wip')}
            >
                <Mail size={24} />
            </button>
        </nav>
      </div>
    </header>
  );
};