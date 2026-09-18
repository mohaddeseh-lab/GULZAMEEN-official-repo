import React from 'react';
import { Logo } from './Logo';
import { Instagram, Twitter, Github, Mail, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Explore', href: '#explore' },
    { name: 'Regions', href: '#regions' },
    { name: 'Cultural Web', href: '#network' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Games', href: '#games' },
    { name: 'Contribute', href: '#contribute' },
    { name: 'Feedback', href: '#feedback' }
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/mohadeseh.badpa', icon: Instagram },
    { name: 'GitHub', href: 'https://github.com/mohaddeseh-lab', icon: Github },
    { name: 'Email', href: 'mailto:mohaddesehbadpa0@gmail.com', icon: Mail }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1A100C] border-t-2 border-[#D4AF37]/30 text-[#F9F4EE]/80 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F9F4EE]/15">
          
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-[#F9F4EE]/80 leading-relaxed max-w-sm">
              Gulzameen is a digital archive and cultural platform dedicated to recording, preserving, and celebrating the oral epics, music, needlework patterns, and recipes of Balochistan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-[#281C16] text-[#D4AF37] hover:bg-[#C2593F] hover:text-[#F9F4EE] border border-[#D4AF37]/20 transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Nav Links (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Navigation & Archives
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  • {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Creator & Preservation Tag (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Preservation Initiative
            </h4>
            <div className="p-4 rounded bg-[#281C16] border border-[#D4AF37]/20 space-y-2 text-xs">
              <div className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Project by: Mohaddeseh Badpa
              </div>
              <p className="text-[11px] text-[#F9F4EE]/70 leading-relaxed">
                Empowering communities globally to document indigenous wisdom and living oral traditions.
              </p>
              <div className="pt-1.5 flex flex-col gap-1 text-[11px] text-[#D4AF37]">
                <a href="https://instagram.com/mohadeseh.badpa" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                  <Instagram className="w-3 h-3 text-[#C2593F]" /> mohadeseh.badpa
                </a>
                <a href="https://github.com/mohaddeseh-lab" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                  <Github className="w-3 h-3 text-[#C2593F]" /> mohaddeseh-lab
                </a>
                <a href="mailto:mohaddesehbadpa0@gmail.com" className="flex items-center gap-1.5 hover:underline">
                  <Mail className="w-3 h-3 text-[#C2593F]" /> mohaddesehbadpa0@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F9F4EE]/60 gap-4">
          <div>
            © {new Date().getFullYear()} Gulzameen • All Cultural Rights Reserved
          </div>
          <div className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#C2593F] fill-[#C2593F]" /> for Balochistan Heritage
          </div>
        </div>

      </div>
    </footer>
  );
};
