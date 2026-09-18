import React from 'react';
import { CulturalItem } from '../types';
import { BarChart2, Users, BookOpen, ShieldCheck, MapPin } from 'lucide-react';

interface AnalyticsProps {
  culturalItems: CulturalItem[];
  totalContributions: number;
}

export const AnalyticsSection: React.FC<AnalyticsProps> = ({ culturalItems, totalContributions }) => {
  const totalItems = culturalItems.length;

  // Real live counts calculated directly from archive state
  const storiesCount = culturalItems.filter((i) => i.category === 'kissa').length;
  const musicCount = culturalItems.filter((i) => i.category === 'saoth').length;
  const embroideryCount = culturalItems.filter((i) => i.category === 'baloch_duch').length;
  const recipeCount = culturalItems.filter((i) => i.category === 'recipes').length;
  const proverbCount = culturalItems.filter((i) => i.category === 'bathal').length;

  const easternCount = culturalItems.filter((i) => i.region === 'eastern' || i.region === 'all').length;
  const westernCount = culturalItems.filter((i) => i.region === 'western' || i.region === 'all').length;
  const southernCount = culturalItems.filter((i) => i.region === 'southern' || i.region === 'all').length;

  const categories = [
    { label: 'Folk Stories (Kissa)', count: storiesCount, color: 'bg-[#D4AF37]', textColor: 'text-[#2D1E18]' },
    { label: 'Music & Songs (Saoth)', count: musicCount, color: 'bg-[#C05A3E]', textColor: 'text-white' },
    { label: 'Embroidery (Duch)', count: embroideryCount, color: 'bg-[#2D1E18]', textColor: 'text-[#D4AF37]' },
    { label: 'Cuisine (Recipes)', count: recipeCount, color: 'bg-[#9A3B1B]', textColor: 'text-white' },
    { label: 'Proverbs (Bathal)', count: proverbCount, color: 'bg-amber-700', textColor: 'text-white' }
  ];

  const maxCategoryVal = Math.max(1, ...categories.map((c) => c.count));

  const regionsData = [
    { name: 'Eastern Balochistan', count: easternCount, tagline: 'Plains & Oral Ballads' },
    { name: 'Western Balochistan', count: westernCount, tagline: 'Highlands & Suroz Music' },
    { name: 'Southern Balochistan', count: southernCount, tagline: 'Makran Coast & Palm Groves' }
  ];

  const maxRegionVal = Math.max(1, ...regionsData.map((r) => r.count));

  return (
    <section id="analytics" className="py-20 bg-[#F9F4EE] border-b-2 border-[#1A100C]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A100C] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Live Archive Analytics</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A100C]">
            Preserving Culture Together
          </h2>
          <p className="text-sm sm:text-base text-[#2B231F]/90">
            Real-time metrics calculated directly from verified heritage records and live community contributions.
          </p>
        </div>

        {/* Top Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white rounded-2xl p-6 border border-[#1A100C]/15 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#1A100C] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#1A100C]">{totalItems}</div>
              <div className="text-xs text-[#2B231F]/80 font-medium font-sans">Total Archived Items</div>
              <div className="text-[10px] text-[#C05A3E] font-semibold mt-0.5">Live Real-time Records</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#1A100C]/15 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C05A3E]/10 text-[#C05A3E] flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#1A100C]">{totalContributions}</div>
              <div className="text-xs text-[#2B231F]/80 font-medium">Community Contributions</div>
              <div className="text-[10px] text-[#C05A3E] font-semibold mt-0.5">User Submitted & Moderated</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#1A100C]/15 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 text-[#1A100C] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#1A100C]">Authentic</div>
              <div className="text-xs text-[#2B231F]/80 font-medium">Cultural Standard</div>
              <div className="text-[10px] text-[#C05A3E] font-semibold mt-0.5">No Simulated Data</div>
            </div>
          </div>

        </div>

        {/* Real Live Category Distribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2D1E18]/15 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2D1E18] mb-1">
                Category Distribution
              </h3>
              <p className="text-xs text-[#4A3B34] mb-6">
                Live breakdown of cultural entries currently preserved in the archive.
              </p>

              <div className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-[#2D1E18]">
                      <span>{cat.label}</span>
                      <span className="font-bold">{cat.count} items</span>
                    </div>
                    <div className="w-full bg-[#FAF4EB] h-3.5 rounded-full overflow-hidden border border-[#2D1E18]/10 p-0.5">
                      <div
                        style={{ width: `${(cat.count / maxCategoryVal) * 100}%` }}
                        className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2D1E18]/15 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2D1E18] mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C05A3E]" />
                Regional Preservation Breakdown
              </h3>
              <p className="text-xs text-[#4A3B34] mb-6">
                Active cultural entries cataloged per geographic region of Balochistan.
              </p>

              <div className="space-y-5">
                {regionsData.map((reg, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#2D1E18]">
                      <div>
                        <span className="font-bold block">{reg.name}</span>
                        <span className="text-[10px] text-[#4A3B34]">{reg.tagline}</span>
                      </div>
                      <span className="font-bold text-sm bg-[#FAF4EB] px-2.5 py-1 rounded border border-[#2D1E18]/15">
                        {reg.count} entries
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF4EB] h-3.5 rounded-full overflow-hidden border border-[#2D1E18]/10 p-0.5">
                      <div
                        style={{ width: `${(reg.count / maxRegionVal) * 100}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#C05A3E] to-[#D4AF37] transition-all duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
