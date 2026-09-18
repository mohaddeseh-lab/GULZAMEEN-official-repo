import React, { useState } from 'react';
import { History, Shield, BookOpen, Scroll, Sparkles, Feather, Music, Utensils, Landmark, Users, Compass, Shirt } from 'lucide-react';

interface EraSubSection {
  subtitle: string;
  body: string;
}

interface EraItem {
  id: string;
  title: string;
  timeframe: string;
  intro?: string;
  subsections: EraSubSection[];
  tags: string[];
}

interface PillarItem {
  id: string;
  title: string;
  category: string;
  content: string;
  icon: React.ElementType;
}

export const CulturalHistory: React.FC = () => {
  const [activeEra, setActiveEra] = useState<string>('origins');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const eras: EraItem[] = [
    {
      id: 'origins',
      title: 'Historical Origins & Migrations',
      timeframe: 'c. 7000 BCE – 16th Century',
      intro: 'The cultural foundations of the region run exceptionally deep, tied to both prehistoric settlements and later medieval migrations:',
      subsections: [
        {
          subtitle: 'Prehistoric Roots (Mehrgarh Civilisation)',
          body: 'Long before the modern Baloch tribes arrived, the region birthed the Mehrgarh civilisation (c. 7000–6000 BCE) on the Kachi Plain. The earliest settled villages in the region date to the ceramic Neolithic, which may make Balochistan the oldest civilisation in the world.',
        },
        {
          subtitle: 'The Caspian Migration',
          body: 'The Baloch people themselves are an Indo-Iranian group believed to have originated on the Iranian plateau near the Caspian Sea. Historical texts track their gradual eastward displacement. The Seljuq invasion in the 11th century stimulated their eastward migration. By the 15th and 16th centuries, these tribes consolidated power in their current homeland, leading to the formation of the historic State of Kalat.',
        },
      ],
      tags: ['Mehrgarh Civilisation (7000 BCE)', 'Kachi Plain', 'Ceramic Neolithic', 'Caspian Sea Origins', 'Seljuq Period Migration', 'State of Kalat'],
    },
    {
      id: 'social-code',
      title: 'Social Structure & The Tribal Code',
      timeframe: 'Patrilineal Order & Living Code',
      intro: 'Baloch society is traditionally patrilineal and strictly organised around a distinct tribal hierarchy.',
      subsections: [
        {
          subtitle: 'Tribal Structure (Tuman & Leadership)',
          body: 'Communities are divided into major tribes (tuman)—such as the Rind, Marri, and Bugti—each led by a central chief known as a Sardar, alongside sub-tribe heads called Maliks, Takaris, or Mirs.',
        },
        {
          subtitle: 'Baluchmayar (The Ethical Code)',
          body: 'This is the unwritten, binding ethical code that governs all Baloch tribal interactions. It mandates unconditional hospitality (Mehman-nawazi), providing sanctuary (Bahrot) to those seeking protection, and defending personal and tribal honour (Ghairat).',
        },
      ],
      tags: ['Patrilineal Hierarchy', 'Tuman (Major Tribes)', 'Rind, Marri & Bugti', 'Sardar & Mirs', 'Baluchmayar', 'Mehman-nawazi (Hospitality)', 'Bahrot (Sanctuary)', 'Ghairat (Honour)'],
    },
    {
      id: 'language-lit',
      title: 'Language & Oral Literature',
      timeframe: 'Northwestern Iranian Tongue & Epic Verse',
      subsections: [
        {
          subtitle: 'The Balochi Language',
          body: 'A Northwestern Iranian tongue, Balochi exists in three main dialect groups: Eastern (Sulaimani), Southern (Makrani), and Western (Rakhshani). Historically, it was purely a spoken tongue. Before the 19th century, the Balochi language was a verbal language; it had no written instructions. For writing, Baloch people used Persian scripts or Arabic scripts.',
        },
        {
          subtitle: 'Poetry and Folklore',
          body: 'Because the language was oral for centuries, history was recorded via epic poetry. Famed generational conflicts, like the legendary 30-year Rind-Lashari war, were preserved through spoken epics. Modern literature owes its growth to mid-20th-century national poets like Mir Gul Khan Nasir and Atta Shad.',
        },
      ],
      tags: ['Northwestern Iranian Tongue', 'Eastern (Sulaimani)', 'Southern (Makrani)', 'Western (Rakhshani)', 'Oral Tradition', 'Rind-Lashari War Epic', 'Mir Gul Khan Nasir', 'Atta Shad'],
    },
    {
      id: 'arts-music',
      title: 'Traditional Arts, Attire, and Music',
      timeframe: 'Vivid Expressive Culture',
      intro: 'Balochistan’s physical landscape may be arid, but its expressive culture is incredibly vivid:',
      subsections: [
        {
          subtitle: 'Embroidery (Doch) and Weaving',
          body: 'Baloch women are world-renowned for their intricate, vibrant geometric needlework, often incorporating tiny mirrors into dresses. Weaving camel-hair rugs and making durable leather or palm-mat products are also core historic crafts.',
        },
        {
          subtitle: 'Clothing (Pagh & Pashk)',
          body: 'Men wear highly distinctive, exceptionally baggy shalwar kameez paired with large, meticulously wrapped turbans (Pagh) that symbolise tribal honor. Women wear flowing, colorful frocks heavily adorned with handmade chest and pocket embroidery (Pashk).',
        },
        {
          subtitle: 'Music and Dance (Soroz, Benju & Chaap)',
          body: 'Cultural celebrations feature spiritual, rhythmic folk music utilizing traditional string instruments like the Soroz (or Sarod) and Benju. The most famous folk dance is the Chaap (or Dochaapi), where men move synchronously in a circle, clapping and stepping to the heavy beat of a dholak (drum).',
        },
      ],
      tags: ['Embroidery (Doch) & Mirrorwork', 'Camel-Hair Rugs', 'Pagh (Honor Turban)', 'Pashk Frock', 'Soroz & Benju Strings', 'Chaap (Dochaapi) Dance', 'Dholak Rhythms'],
    },
    {
      id: 'cuisine',
      title: 'Cuisine & Nomadic Heritage',
      timeframe: 'Pastoral Open-Fire Culinary Legacy',
      subsections: [
        {
          subtitle: 'Pastoral Open-Fire Legacy',
          body: 'Balochi food reflects a nomadic, pastoral legacy where meat preservation and slow open-fire cooking are essential.',
        },
        {
          subtitle: 'Sajji (Slow-Roasted Tender Lamb or Goat)',
          body: 'Its most famous culinary export is Sajji—a whole lamb or goat skewered and slow-roasted to tender perfection around a circle of open wood embers, seasoned lightly with salt and papaya paste.',
        },
        {
          subtitle: 'Khaddi Kabab & Kaak Bread',
          body: 'Other staples include Khaddi Kabab (meat cooked inside an underground mud oven) and Kaak, a hard, stone-baked bread.',
        },
      ],
      tags: ['Nomadic Pastoral Legacy', 'Sajji (Wood Embers Roast)', 'Papaya & Salt Seasoning', 'Khaddi Kabab (Mud Oven)', 'Kaak (Stone-Baked Bread)', 'Meat Preservation'],
    },
  ];

  const pillars: PillarItem[] = [
    {
      id: 'p1',
      title: 'Prehistoric Roots (Mehrgarh)',
      category: 'Origins',
      content: 'Long before modern Baloch tribes arrived, the region birthed the Mehrgarh civilisation (c. 7000–6000 BCE) on the Kachi Plain. The earliest settled villages date to the ceramic Neolithic, establishing Balochistan among the oldest civilisations in the world.',
      icon: Landmark,
    },
    {
      id: 'p2',
      title: 'The Caspian Migration & Kalat',
      category: 'Origins',
      content: 'The Baloch people are an Indo-Iranian group originating on the Iranian plateau near the Caspian Sea. The 11th-century Seljuq invasion stimulated eastward migration, and by the 15th and 16th centuries power consolidated to establish the historic State of Kalat.',
      icon: Compass,
    },
    {
      id: 'p3',
      title: 'Tribal Structure (Tuman & Sardars)',
      category: 'Society',
      content: 'Communities are organized into major tribes (tuman)—such as the Rind, Marri, and Bugti—each governed by a central chief known as a Sardar, alongside sub-tribe heads called Maliks, Takaris, or Mirs in a patrilineal hierarchy.',
      icon: Users,
    },
    {
      id: 'p4',
      title: 'Baluchmayar (The Tribal Code)',
      category: 'Ethics',
      content: 'The unwritten, sacred ethical code governing all Baloch tribal interactions. It mandates unconditional hospitality (Mehman-nawazi), providing sanctuary (Bahrot) to anyone seeking refuge, and defending personal and tribal honour (Ghairat).',
      icon: Shield,
    },
    {
      id: 'p5',
      title: 'The Balochi Language',
      category: 'Language',
      content: 'A Northwestern Iranian tongue with three main dialect groups: Eastern (Sulaimani), Southern (Makrani), and Western (Rakhshani). Historically purely verbal without written instructions, using Persian or Arabic scripts when transcribed.',
      icon: Feather,
    },
    {
      id: 'p6',
      title: 'Poetry and Oral Folklore',
      category: 'Literature',
      content: 'Because language was oral for centuries, history was recorded via epic poetry—including generational sagas like the 30-year Rind-Lashari war. Modern literature was shaped by mid-20th-century national poets like Mir Gul Khan Nasir and Atta Shad.',
      icon: Scroll,
    },
    {
      id: 'p7',
      title: 'Embroidery (Doch) and Weaving',
      category: 'Arts',
      content: 'Baloch women are world-renowned for intricate, vibrant geometric needlework incorporating tiny mirrors into dresses. Weaving camel-hair rugs and handcrafting durable leather or palm-mat products are core historic crafts.',
      icon: Sparkles,
    },
    {
      id: 'p8',
      title: 'Traditional Clothing (Pagh & Pashk)',
      category: 'Attire',
      content: 'Men wear exceptionally baggy shalwar kameez with meticulously wrapped turbans (Pagh) symbolising tribal honor. Women wear flowing, colorful frocks heavily adorned with handmade chest and pocket embroidery (Pashk).',
      icon: Shirt,
    },
    {
      id: 'p9',
      title: 'Music & Dance (Soroz & Chaap)',
      category: 'Music',
      content: 'Celebrations feature spiritual folk music with string instruments like the Soroz (Sarod) and Benju. In the famous Chaap (Dochaapi) dance, participants move synchronously in a circle, clapping and stepping to the heavy beat of a dholak.',
      icon: Music,
    },
    {
      id: 'p10',
      title: 'Nomadic Cuisine (Sajji & Kaak)',
      category: 'Cuisine',
      content: 'Reflects pastoral open-fire cooking and meat preservation. Famous for Sajji—whole lamb or goat skewered and slow-roasted around wood embers seasoned with salt and papaya paste—plus underground mud-oven Khaddi Kabab and stone-baked Kaak bread.',
      icon: Utensils,
    },
  ];

  const categories = ['all', 'Origins', 'Society', 'Ethics', 'Language', 'Literature', 'Arts', 'Attire', 'Music', 'Cuisine'];

  const filteredPillars = selectedCategoryFilter === 'all'
    ? pillars
    : pillars.filter(p => p.category === selectedCategoryFilter);

  return (
    <section id="history" className="py-20 bg-[#F9F4EE] border-b-2 border-[#1A100C]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A100C] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <History className="w-3.5 h-3.5" />
            <span>Living Heritage Chronicle</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A100C]">
            Balochi Cultural History
          </h2>

          <p className="text-base sm:text-lg text-[#2B231F] leading-relaxed font-serif">
            Balochi cultural history is an ancient tapestry shaped by prehistoric civilisations, grand nomadic migrations from the Caspian region, and a fierce, honour-bound tribal code.
          </p>
          
          <p className="text-sm sm:text-base text-[#4A3B34] leading-relaxed max-w-3xl mx-auto">
            Spanning the arid, cross-border region of Balochistan across modern-day Pakistan, Iran, and Afghanistan, the Baloch people have preserved a distinct identity largely due to their rugged geography and limited foreign assimilation.
          </p>
        </div>

        {/* Historical Eras / Chapters Interactive Showcase */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-serif text-2xl font-bold text-[#1A100C] flex items-center gap-2">
              <Scroll className="w-5 h-5 text-[#C2593F]" />
              <span>Historical Chronology & Cultural Foundations</span>
            </h3>
            <span className="text-xs font-semibold text-[#8C6D37] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
              Select a chapter to explore detailed heritage
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Era Tabs / Navigation */}
            <div className="lg:col-span-4 space-y-3">
              {eras.map((era) => {
                const isActive = activeEra === era.id;
                return (
                  <button
                    key={era.id}
                    onClick={() => setActiveEra(era.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                      isActive
                        ? 'bg-[#1A100C] text-[#F9F4EE] border-[#D4AF37] shadow-lg translate-x-1'
                        : 'bg-white text-[#2B231F] border-[#1A100C]/15 hover:border-[#C2593F]'
                    }`}
                  >
                    <div>
                      <div className={`font-serif font-bold text-base ${isActive ? 'text-[#D4AF37]' : 'text-[#1A100C]'}`}>
                        {era.title}
                      </div>
                      <div className={`text-xs font-semibold mt-0.5 ${isActive ? 'text-[#F3E5AB]' : 'text-[#C2593F]'}`}>
                        {era.timeframe}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                      isActive ? 'bg-[#D4AF37] text-[#1A100C]' : 'bg-[#F9F4EE] text-[#1A100C]/70'
                    }`}>
                      {isActive ? 'Active' : 'Read →'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Era Detail Card */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#1A100C]/15 shadow-md space-y-6 relative overflow-hidden min-h-[360px]">
              {eras.filter(e => e.id === activeEra).map((era) => (
                <div key={era.id} className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1A100C]/10 pb-4 gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#C2593F] uppercase tracking-wider">
                        Heritage Chapter
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-[#1A100C]">
                        {era.title}
                      </h4>
                    </div>
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#1A100C] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">
                      {era.timeframe}
                    </span>
                  </div>

                  {era.intro && (
                    <p className="text-sm sm:text-base font-medium text-[#1A100C] italic bg-[#F9F4EE] p-3.5 rounded-xl border-l-4 border-[#C2593F]">
                      {era.intro}
                    </p>
                  )}

                  <div className="space-y-4">
                    {era.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-1.5 bg-[#FAF7F2] p-4 rounded-xl border border-[#1A100C]/10">
                        <h5 className="font-serif font-bold text-base text-[#1A100C] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#C2593F]"></span>
                          {sub.subtitle}
                        </h5>
                        <p className="text-sm text-[#2B231F] leading-relaxed">
                          {sub.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#1A100C]/10">
                    <span className="text-xs font-bold text-[#1A100C] uppercase tracking-wider block mb-2">
                      Key Concepts & Hallmarks:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {era.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-[#F9F4EE] border border-[#D4AF37]/40 text-[#1A100C] text-xs font-semibold shadow-sm"
                        >
                          ✦ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Historical & Cultural Pillars Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A100C] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C2593F]" />
                <span>Foundational Pillars of Balochi Heritage</span>
              </h3>
              <p className="text-xs text-[#2B231F]/80 mt-1">
                Explore individual facets of Balochi origins, tribal law, literature, arts, and lifestyle.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#1A100C] text-[#D4AF37] shadow-sm'
                      : 'bg-white text-[#2B231F] hover:bg-[#F9F4EE] border border-[#1A100C]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-white rounded-xl p-6 border border-[#1A100C]/15 shadow-sm hover:shadow-md hover:border-[#C2593F] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#C2593F]/10 text-[#C2593F] flex items-center justify-center group-hover:bg-[#C2593F] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#F9F4EE] border border-[#1A100C]/10 text-[#1A100C]">
                        {pillar.category}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#1A100C] group-hover:text-[#C2593F] transition-colors">
                      {pillar.title}
                    </h4>

                    <p className="text-xs text-[#2B231F] leading-relaxed">
                      {pillar.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

