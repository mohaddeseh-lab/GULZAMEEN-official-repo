import React from 'react';
import { Compass, PlusCircle, BookOpen, Music, Sparkles, Map, Heart } from 'lucide-react';

interface HeroProps {
  onOpenContributeModal: () => void;
  statsCount?: {
    stories: number;
    songs: number;
    patterns: number;
    regions: number;
  };
}

export const Hero: React.FC<HeroProps> = ({
  onOpenContributeModal,
  statsCount = { stories: 154, songs: 86, patterns: 212, regions: 5 }
}) => {
  const scrollToSection = (id: string) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-baloch-pattern border-b-2 border-[#1A100C]/15">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C2593F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A100C] text-[#D4AF37] text-xs font-semibold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '8s' }} />
            <span>A Living Digital Culture</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#1A100C] tracking-tight leading-none">
            Gulzameen
            <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-[#C2593F] mt-2 font-sans tracking-normal italic font-semibold">
              Balochistan Cultural Archive & Living Web
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-[#2B231F] font-sans leading-relaxed max-w-2xl mx-auto">
            Explore the living heritage of Balochistan. Discover folk tales, oral epics, music, embroidery patterns, and recipes that evolve with every community contribution.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('#regions')}
              className="relative group overflow-hidden w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#1A100C] shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-[#FFF8DC]"
            >
              <span className="absolute inset-0 w-full h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <Compass className="w-4 h-4 text-[#1A100C] group-hover:rotate-45 transition-transform duration-300" />
              <span>Explore Culture</span>
            </button>

            <button
              onClick={onOpenContributeModal}
              className="relative group overflow-hidden w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#1A100C] text-[#D4AF37] hover:text-[#F3E5AB] shadow-lg hover:shadow-[0_0_20px_rgba(26,16,12,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-[#D4AF37]/40"
            >
              <span className="absolute inset-0 w-full h-full bg-[#D4AF37]/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <PlusCircle className="w-4 h-4 text-[#D4AF37] group-hover:rotate-90 transition-transform duration-300" />
              <span>Contribute Your Story</span>
            </button>
          </div>
        </div>

        {/* Dynamic Stat Counters - Theme Stat Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-lg border border-[#1A100C]/10 text-center shadow-sm hover:border-[#C2593F] transition-all">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#C2593F]/10 flex items-center justify-center mb-2 text-[#C2593F]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A100C]">
              {statsCount.stories}+
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C2593F] mt-1">
              Folk Stories (Kissa)
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#1A100C]/10 text-center shadow-sm hover:border-[#D4AF37] transition-all">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/15 flex items-center justify-center mb-2 text-[#1A100C]">
              <Music className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A100C]">
              {statsCount.songs}+
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C2593F] mt-1">
              Traditional Songs (Saoth)
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#1A100C]/10 text-center shadow-sm hover:border-[#C2593F] transition-all">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#C2593F]/10 flex items-center justify-center mb-2 text-[#C2593F]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A100C]">
              {statsCount.patterns}+
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C2593F] mt-1">
              Patterns (Baloch Duch)
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#1A100C]/10 text-center shadow-sm hover:border-[#D4AF37] transition-all">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/15 flex items-center justify-center mb-2 text-[#1A100C]">
              <Map className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A100C]">
              {statsCount.regions}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C2593F] mt-1">
              Cultural Zones
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
