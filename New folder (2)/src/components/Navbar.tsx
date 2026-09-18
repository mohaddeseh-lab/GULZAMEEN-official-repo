import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Compass, MapPin, Share2, BarChart2, Gamepad2, PlusCircle, Menu, X, Sparkles, History, Database } from 'lucide-react';

interface NavbarProps {
  onOpenContributeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContributeModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', href: '#explore', icon: Compass },
    { name: 'History', href: '#history', icon: History },
    { name: 'Regions', href: '#regions', icon: MapPin },
    { name: 'Cultural Web', href: '#network', icon: Share2 },
    { name: 'Analytics', href: '#analytics', icon: BarChart2 },
    { name: 'Games', href: '#games', icon: Gamepad2 },
    { name: 'Contribute', href: '#contribute', icon: PlusCircle },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartJourney = () => {
    const heroElem = document.querySelector('#hero');
    if (heroElem) {
      heroElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1A100C] border-b-4 border-[#D4AF37] ${
        isScrolled ? 'py-2.5 shadow-2xl' : 'py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="group flex items-center gap-3">
          <Logo />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#281C16]/80 px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold text-[#F9F4EE]/90 hover:text-[#D4AF37] hover:bg-[#1A100C] transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5 text-[#C2593F]" />
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons & Cloud DB Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#281C16] border border-[#D4AF37]/30 text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3 h-3 text-[#D4AF37]" />
            <span>Cloud DB Connected</span>
          </div>

          <button
            onClick={onOpenContributeModal}
            className="relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C2593F] via-[#D86C4E] to-[#9A3B1B] text-[#FAF4EE] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(194,89,63,0.4)] hover:scale-[1.02] active:scale-95 border border-[#D4AF37]/40"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <PlusCircle className="w-4 h-4 text-[#F3E5AB] group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Story</span>
          </button>

          <button
            onClick={handleStartJourney}
            className="relative group overflow-hidden flex items-center gap-2 px-4.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#1A100C] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-95 border border-[#FFF8DC]/60"
          >
            <span className="absolute inset-0 w-full h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <Sparkles className="w-3.5 h-3.5 text-[#1A100C] group-hover:rotate-45 transition-transform duration-300" />
            <span>Start Journey</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded bg-[#281C16] text-[#F9F4EE] border border-[#D4AF37]/40 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A100C] border-b-2 border-[#D4AF37] px-4 pt-4 pb-6 mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center gap-2.5 p-2.5 rounded text-xs font-semibold text-[#F9F4EE] bg-[#281C16] hover:bg-[#1A100C] border border-[#D4AF37]/20 uppercase tracking-wider"
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContributeModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-semibold bg-[#C2593F] text-[#FAF4EE] border border-[#D4AF37]/30"
            >
              <PlusCircle className="w-4 h-4 text-[#F3E5AB]" />
              Contribute Your Story
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleStartJourney();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#1A100C]"
            >
              <Sparkles className="w-4 h-4" />
              Start Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
