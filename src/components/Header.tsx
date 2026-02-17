import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Mail, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: 'landing' | 'wip';
  onNavigate: (view: 'landing' | 'wip') => void;
  onScrollToSection: (sectionId: string) => void;
}

const navLinks = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Tarifas', href: '#soluciones' },
  { label: 'Contacto', href: '#contacto' },
];

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onScrollToSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    onScrollToSection(href);
  };

  const handleLogoClick = () => {
    if (currentView === 'wip') {
      onNavigate('landing');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-norien-bg/80 backdrop-blur-md border-white/5 py-4'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-norien-silver hover:text-white transition-colors tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Contact Button */}
        <Button
          variant="outline"
          className="hidden md:flex !py-2 !px-5 text-sm"
          onClick={() => onScrollToSection('#contacto')}
        >
          <Mail size={16} />
          <span>Contacto</span>
        </Button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-norien-gold p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-norien-bg/95 backdrop-blur-md border-t border-white/5">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-norien-silver hover:text-white transition-colors tracking-wide uppercase text-sm py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
