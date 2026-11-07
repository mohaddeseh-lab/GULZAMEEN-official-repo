'use client';

import React from 'react';
import { Logo } from './Logo';
 import { Camera, Link2, Mail, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Explore', href: '#explore' },
    { name: 'Regions', href: '#regions' },
    { name: 'Cultural Web', href: '#network' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Games', href: '#games' },
    { name: 'Contribute', href: '#contribute' },
    { name: 'Feedback', href: '#feedback' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/mohadeseh.badpa',
      icon: Camera,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/mohaddeseh-lab',
      icon: Link2,
    },
    {
      name: 'Email',
      href: 'mailto:mohaddesehbadpa0@gmail.com',
      icon: Mail,
    },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <footer className="relative overflow-hidden border-t-2 border-[#D4AF37]/30 bg-[#1A100C] pt-16 pb-12 text-[#F9F4EE]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-[#F9F4EE]/15 pb-12 md:grid-cols-12">

          {/* Brand */}
          <div className="space-y-4 md:col-span-5">
            <Logo size="lg" />

            <p className="max-w-sm text-xs leading-relaxed text-[#F9F4EE]/80">
              Gulzameen is a digital archive and cultural platform dedicated
              to recording, preserving, and celebrating the oral epics, music,
              needlework patterns, and recipes of Balochistan.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="rounded border border-[#D4AF37]/20 bg-[#281C16] p-2 text-[#D4AF37] transition-all hover:bg-[#C2593F] hover:text-[#F9F4EE]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3 md:col-span-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Navigation & Archives
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="transition-colors hover:text-[#D4AF37]"
                >
                  • {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Preservation Initiative */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Preservation Initiative
            </h4>

            <div className="space-y-2 rounded border border-[#D4AF37]/20 bg-[#281C16] p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" />
                Project by: Mohaddeseh Badpa
              </div>

              <p className="text-[11px] leading-relaxed text-[#F9F4EE]/70">
                Empowering communities globally to document indigenous wisdom
                and living oral traditions.
              </p>

              <div className="flex flex-col gap-1 pt-1.5 text-[11px] text-[#D4AF37]">
                <a
                  href="https://instagram.com/mohadeseh.badpa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Camera className="h-3 w-3 text-[#C2593F]" />
                  mohadeseh.badpa
                </a>

                <a
                  href="https://github.com/mohaddeseh-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Link2 className="h-3 w-3 text-[#C2593F]" />
                  mohaddeseh-lab
                </a>

                <a
                  href="mailto:mohaddesehbadpa0@gmail.com"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Mail className="h-3 w-3 text-[#C2593F]" />
                  mohadesehbadpa0@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-[#F9F4EE]/60 sm:flex-row">
          <div>
            © {new Date().getFullYear()} Gulzameen • All Cultural Rights Reserved
          </div>

          <div className="flex items-center gap-1">
            Crafted with
            <Heart className="h-3.5 w-3.5 fill-[#C2593F] text-[#C2593F]" />
            for Balochistan Heritage
          </div>
        </div>
      </div>
    </footer>
  );
};
