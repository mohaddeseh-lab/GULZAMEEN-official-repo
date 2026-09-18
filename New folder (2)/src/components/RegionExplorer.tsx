import React, { useState } from 'react';
import { CulturalItem, RegionId, CategoryId } from '../types';
import { REGIONS } from '../data/initialData';
import { MapPin, BookOpen, Music, Utensils, Sparkles, Quote, Play, Pause, Volume2, ChevronRight, X, Filter, Search, Heart, VolumeX, Plus, Bookmark, Flag, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface RegionExplorerProps {
  culturalItems: CulturalItem[];
  onOpenContributeModal: (region?: RegionId, category?: CategoryId) => void;
  onRemoveItem?: (id: string) => void;
  onReportItem?: (id: string, title: string, reason: string, details?: string) => void;
}

export const RegionExplorer: React.FC<RegionExplorerProps> = ({
  culturalItems,
  onOpenContributeModal,
  onRemoveItem,
  onReportItem
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('eastern');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all' | 'saved'>('kissa');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemModal, setActiveItemModal] = useState<CulturalItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Modal states for report and delete
  const [reportTarget, setReportTarget] = useState<CulturalItem | null>(null);
  const [reportReason, setReportReason] = useState<string>('Hate Speech or Harassment');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [reportAlsoHide, setReportAlsoHide] = useState<boolean>(true);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<CulturalItem | null>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gz_bookmarked_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleOpenReportModal = (item: CulturalItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReportTarget(item);
    setReportReason('Hate Speech or Harassment');
    setReportDetails('');
    setReportAlsoHide(true);
    setReportSubmitted(false);
  };

  const handleOpenDeleteModal = (item: CulturalItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteTarget(item);
  };

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget) return;

    if (onReportItem) {
      onReportItem(reportTarget.id, reportTarget.title, reportReason, reportDetails);
    }

    if (reportAlsoHide && onRemoveItem) {
      onRemoveItem(reportTarget.id);
    }

    setReportSubmitted(true);
    setTimeout(() => {
      if (activeItemModal?.id === reportTarget.id) {
        setActiveItemModal(null);
      }
      setReportTarget(null);
      setReportSubmitted(false);
    }, 2000);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (onRemoveItem) {
      onRemoveItem(deleteTarget.id);
    }
    if (activeItemModal?.id === deleteTarget.id) {
      setActiveItemModal(null);
    }
    setDeleteTarget(null);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('gz_bookmarked_ids', JSON.stringify(next));
      return next;
    });
  };

  const speakText = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const currentRegionInfo = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];

  const filteredItems = culturalItems.filter((item) => {
    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.balochiTitle && item.balochiTitle.toLowerCase().includes(q)) ||
        (item.translation && item.translation.toLowerCase().includes(q));
      if (!matchQuery) return false;
    }

    // Category / Saved filter
    if (selectedCategory === 'saved') {
      return bookmarkedIds.includes(item.id);
    }

    if (selectedCategory !== 'all') {
      if (item.category !== selectedCategory) return false;
    }

    // Region filter (if not searching globally)
    if (searchQuery.trim() === '' && selectedCategory !== 'saved') {
      return item.region === selectedRegion || item.region === 'all';
    }

    return true;
  });

  const categories: { id: CategoryId | 'all' | 'saved'; name: string; balochi: string; icon: React.ElementType }[] = [
    { id: 'kissa', name: 'Folk Stories', balochi: 'قصه', icon: BookOpen },
    { id: 'saoth', name: 'Music', balochi: 'صوت', icon: Music },
    { id: 'recipes', name: 'Recipes', balochi: 'خوراک', icon: Utensils },
    { id: 'baloch_duch', name: 'Embroidery', balochi: 'دۆچ', icon: Sparkles },
    { id: 'bathal', name: 'Proverbs', balochi: 'بتل', icon: Quote },
    { id: 'saved', name: `Saved (${bookmarkedIds.length})`, balochi: 'ذخیره', icon: Bookmark },
  ];

  const toggleAudio = (id: string) => {
    if (isPlayingAudio === id) {
      setIsPlayingAudio(null);
    } else {
      setIsPlayingAudio(id);
    }
  };

  return (
    <section id="regions" className="py-20 bg-[#F5E6D3] text-[#1A120E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2D1E18] text-[#D4AF37] text-xs font-semibold tracking-wider uppercase shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Interactive Map & Regional Heritage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D1E18]">
            Explore Regional Traditions
          </h2>
          <p className="text-sm sm:text-base text-[#4A3B34]">
            Select a geographic region on the map or click a regional card below to unlock its distinct folklore, music, recipes, needlework, and sayings.
          </p>
        </div>

        {/* Interactive Map & Regional Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Interactive SVG Balochistan Map (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#2D1E18]/15 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2D1E18]/15">
              <span className="text-xs font-serif font-bold tracking-wider uppercase text-[#C05A3E] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C05A3E] animate-ping" />
                Balochistan Cultural Map
              </span>
              <span className="text-[11px] text-[#4A3B34] font-medium">Click a region node to activate</span>
            </div>

            {/* Stylized SVG Map Container */}
            <div className="relative w-full aspect-[16/10] bg-sand-radial rounded-xl border-2 border-dashed border-[#D4AF37] p-2 overflow-hidden group">
              <svg viewBox="0 0 500 350" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="eastGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#C05A3E" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F5E6D3" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="westGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2D1E18" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="southGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#9A3B1B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F5E6D3" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Regional Geographic Polygons */}
                <path
                  d="M 60 50 L 220 40 L 250 160 L 160 220 L 50 180 Z"
                  fill="url(#westGrad)"
                  stroke={selectedRegion === 'western' ? '#D4AF37' : '#2D1E18'}
                  strokeWidth={selectedRegion === 'western' ? 3.5 : 1.5}
                  className="cursor-pointer hover:opacity-80 transition-all duration-300"
                  onClick={() => setSelectedRegion('western')}
                />

                <path
                  d="M 220 40 L 440 30 L 450 180 L 320 220 L 250 160 Z"
                  fill="url(#eastGrad)"
                  stroke={selectedRegion === 'eastern' ? '#D4AF37' : '#C05A3E'}
                  strokeWidth={selectedRegion === 'eastern' ? 3.5 : 1.5}
                  className="cursor-pointer hover:opacity-80 transition-all duration-300"
                  onClick={() => setSelectedRegion('eastern')}
                />

                <path
                  d="M 160 220 L 320 220 L 420 300 L 80 300 Z"
                  fill="url(#southGrad)"
                  stroke={selectedRegion === 'southern' ? '#D4AF37' : '#9A3B1B'}
                  strokeWidth={selectedRegion === 'southern' ? 3.5 : 1.5}
                  className="cursor-pointer hover:opacity-80 transition-all duration-300"
                  onClick={() => setSelectedRegion('southern')}
                />

                <path d="M 50 320 Q 150 310, 250 320 T 450 315" stroke="#C05A3E" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" />

                {/* Region Nodes & Labels */}
                <g className="cursor-pointer" onClick={() => setSelectedRegion('western')}>
                  <circle cx="140" cy="120" r={selectedRegion === 'western' ? 14 : 10} fill="#D4AF37" opacity="0.4" />
                  <circle cx="140" cy="120" r="6" fill={selectedRegion === 'western' ? '#D4AF37' : '#C05A3E'} stroke="#FFFFFF" strokeWidth="2" />
                  <text x="140" y="145" textAnchor="middle" fill="#2D1E18" fontSize="12" fontWeight="bold" fontFamily="Cinzel">
                    Western
                  </text>
                  <text x="140" y="160" textAnchor="middle" fill="#C05A3E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Highlands & Suroz
                  </text>
                </g>

                <g className="cursor-pointer" onClick={() => setSelectedRegion('eastern')}>
                  <circle cx="330" cy="110" r={selectedRegion === 'eastern' ? 14 : 10} fill="#C05A3E" opacity="0.4" />
                  <circle cx="330" cy="110" r="6" fill={selectedRegion === 'eastern' ? '#D4AF37' : '#C05A3E'} stroke="#FFFFFF" strokeWidth="2" />
                  <text x="330" y="135" textAnchor="middle" fill="#2D1E18" fontSize="12" fontWeight="bold" fontFamily="Cinzel">
                    Eastern
                  </text>
                  <text x="330" y="150" textAnchor="middle" fill="#C05A3E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Epics & Plains
                  </text>
                </g>

                <g className="cursor-pointer" onClick={() => setSelectedRegion('southern')}>
                  <circle cx="250" cy="260" r={selectedRegion === 'southern' ? 14 : 10} fill="#9A3B1B" opacity="0.4" />
                  <circle cx="250" cy="260" r="6" fill={selectedRegion === 'southern' ? '#D4AF37' : '#9A3B1B'} stroke="#FFFFFF" strokeWidth="2" />
                  <text x="250" y="282" textAnchor="middle" fill="#2D1E18" fontSize="12" fontWeight="bold" fontFamily="Cinzel">
                    Southern
                  </text>
                  <text x="250" y="295" textAnchor="middle" fill="#C05A3E" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Makran Coast
                  </text>
                </g>
              </svg>

              <div className="absolute bottom-3 left-3 bg-[#2D1E18] px-3 py-1.5 rounded text-[11px] text-[#F5E6D3] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                Active Region: <strong className="text-[#D4AF37] font-serif">{currentRegionInfo.name}</strong>
              </div>
            </div>
          </div>

          {/* 3 Region Overview Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {REGIONS.map((region) => {
              const isSelected = selectedRegion === region.id;
              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`p-5 rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden bg-white ${
                    isSelected
                      ? 'border-b-4 border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30'
                      : 'border-b-4 border-[#C05A3E] border border-[#2D1E18]/10 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#C05A3E]">
                        {region.climate}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#2D1E18] mt-0.5">
                        {region.name}
                      </h3>
                      <p className="text-xs text-[#C05A3E] font-medium italic mt-0.5">
                        "{region.tagline}"
                      </p>
                    </div>
                    {isSelected && (
                      <span className="bg-[#D4AF37] text-[#2D1E18] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#4A3B34] mt-2.5 line-clamp-2 leading-relaxed">
                    {region.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#2D1E18]/10 flex items-center justify-between text-[11px] text-[#2D1E18]/80 font-medium">
                    <span className="truncate">🎨 {region.famousArt}</span>
                    <span className="flex items-center text-[#C05A3E] font-bold hover:underline">
                      View Archive <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Content Explorer Header & Controls */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#2D1E18]/15 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2D1E18]/15">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#C05A3E] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Cultural Archive Explorer
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E18] mt-1">
                {selectedCategory === 'saved'
                  ? 'Your Saved Heritage Collection'
                  : searchQuery.trim() !== ''
                  ? `Search Results for "${searchQuery}"`
                  : `${currentRegionInfo.name} Traditions`}
              </h3>
            </div>

            {/* Quick Search Bar & Add Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#C05A3E] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, recipes..."
                  className="w-full bg-[#FAF4EB] border border-[#2D1E18]/20 rounded-lg pl-9 pr-8 py-2 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[#4A3B34] hover:text-[#2D1E18]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => onOpenContributeModal(selectedRegion, selectedCategory === 'saved' || selectedCategory === 'all' ? 'kissa' : selectedCategory)}
                className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C05A3E] to-[#9A3B1B] text-[#FAF4EB] hover:shadow-md transition-all border border-[#2D1E18]/10 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#F3E5AB]" />
                Add Heritage Story
              </button>
            </div>
          </div>

          {/* Category Tabs (Design Theme Bar) */}
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 my-4 bg-[#2D1E18] rounded-xl border border-[#2D1E18] no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#1C120C] shadow-md font-extrabold'
                      : 'text-[#F5E6D3]/80 hover:text-[#D4AF37] hover:bg-[#1F1410]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1C120C]' : 'text-[#D4AF37]'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${isActive ? 'bg-[#1C120C]/20 text-[#1C120C]' : 'bg-[#1F1410] text-[#D4AF37]'}`}>
                    {cat.balochi}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Items Grid */}
          <div className="mt-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 px-4 bg-[#FAF4EB] rounded-xl border border-dashed border-[#C05A3E]/40 space-y-3">
                <p className="text-sm text-[#4A3B34] font-medium">
                  {selectedCategory === 'saved'
                    ? 'You have not saved any heritage items yet. Click the heart icon on any story card to save it!'
                    : `No contributions found for this selection in ${currentRegionInfo.name}.`}
                </p>
                <button
                  onClick={() => onOpenContributeModal(selectedRegion, selectedCategory === 'saved' ? 'kissa' : selectedCategory === 'all' ? 'kissa' : selectedCategory)}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#2D1E18] text-xs font-bold uppercase tracking-wider hover:shadow-md transition-all"
                >
                  Be the First to Contribute!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isBookmarked = bookmarkedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="bg-[#FAF4EB] rounded-xl p-5 border border-[#2D1E18]/15 hover:border-[#C05A3E] transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md relative overflow-hidden"
                    >
                      <div>
                        {/* Top Bar */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2D1E18] text-[#D4AF37]">
                              {categories.find((c) => c.id === item.category)?.name || item.category}
                            </span>
                            {item.region === 'all' && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C05A3E] text-white">
                                All Regions
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {item.balochiTitle && (
                              <span className="text-xs text-[#C05A3E] font-bold">
                                {item.balochiTitle}
                              </span>
                            )}
                            {/* Bookmark Heart */}
                            <button
                              onClick={(e) => toggleBookmark(item.id, e)}
                              className={`p-1.5 rounded-full transition-transform active:scale-75 ${
                                isBookmarked ? 'text-[#C05A3E] bg-[#C05A3E]/10' : 'text-[#2D1E18]/40 hover:text-[#C05A3E]'
                              }`}
                              title={isBookmarked ? 'Remove Bookmark' : 'Save Story'}
                            >
                              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-[#C05A3E]' : ''}`} />
                            </button>

                            {/* Report Harmful Content */}
                            <button
                              onClick={(e) => handleOpenReportModal(item, e)}
                              className="p-1.5 rounded-full text-[#2D1E18]/40 hover:text-amber-600 hover:bg-amber-100/60 transition-colors"
                              title="Report Harmful Content"
                            >
                              <Flag className="w-4 h-4" />
                            </button>

                            {/* Remove Content */}
                            <button
                              onClick={(e) => handleOpenDeleteModal(item, e)}
                              className="p-1.5 rounded-full text-[#2D1E18]/40 hover:text-rose-600 hover:bg-rose-100/60 transition-colors"
                              title="Remove Content"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-[#2D1E18] group-hover:text-[#C05A3E] transition-colors leading-snug">
                          {item.title}
                        </h4>

                        {/* Media Rendering (Audio Player or Image) */}
                        {(item.audioUrl || item.mediaType === 'audio' || (item.mediaUrl && (item.mediaUrl.startsWith('data:audio') || item.mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i) !== null))) ? (
                          <div className="mt-3 p-3 rounded-lg bg-white border border-[#2D1E18]/15 shadow-xs">
                            <div className="text-[11px] font-bold text-[#C05A3E] mb-1.5 flex items-center gap-1.5">
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Attached Audio Performance:</span>
                            </div>
                            <audio controls src={item.audioUrl || item.mediaUrl} className="w-full h-9 rounded bg-[#FAF4EB] border border-[#2D1E18]/10" />
                          </div>
                        ) : item.mediaUrl ? (
                          <div className="mt-2.5 rounded-lg overflow-hidden border border-[#2D1E18]/15 aspect-[16/9] bg-[#1A100C]">
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : null}

                        <p className="text-xs text-[#4A3B34] mt-2 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>

                        {/* Music Audio Player Simulation for Saoth items without custom audio file */}
                        {item.category === 'saoth' && !item.audioUrl && !(item.mediaUrl && item.mediaUrl.startsWith('data:audio')) && (
                          <div className="mt-4 p-3 rounded-lg bg-white border border-[#2D1E18]/15 flex items-center gap-3 shadow-xs">
                            <button
                              onClick={() => toggleAudio(item.id)}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#2D1E18] flex items-center justify-center hover:scale-105 transition-transform shadow-xs"
                            >
                              {isPlayingAudio === item.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>
                            <div className="flex-1">
                              <div className="text-[11px] font-semibold text-[#2D1E18]">
                                {isPlayingAudio === item.id ? 'Playing Suroz Audio Tune...' : 'Listen to Melody'}
                              </div>
                              <div className="w-full bg-[#F5E6D3] h-1.5 rounded-full mt-1 overflow-hidden">
                                <div
                                  className={`h-full bg-[#C05A3E] transition-all duration-500 ${
                                    isPlayingAudio === item.id ? 'w-2/3 animate-pulse' : 'w-0'
                                  }`}
                                />
                              </div>
                            </div>
                            <Volume2 className="w-4 h-4 text-[#C05A3E]" />
                          </div>
                        )}

                        {/* Embroidery Motifs Badges */}
                        {item.patternMotifs && item.patternMotifs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.patternMotifs.map((motif, i) => (
                              <span key={i} className="text-[10px] bg-white text-[#C05A3E] font-semibold px-2 py-0.5 rounded border border-[#2D1E18]/10">
                                ❖ {motif}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Proverbs Translation Box */}
                        {item.translation && (
                          <div className="mt-3 p-2.5 rounded-lg bg-white border-l-3 border-[#C05A3E] text-xs text-[#2D1E18] italic shadow-xs">
                            "{item.translation}"
                          </div>
                        )}
                      </div>

                      {/* Bottom Actions */}
                      <div className="mt-5 pt-3 border-t border-[#2D1E18]/10 flex items-center justify-between">
                        <span className="text-[10px] text-[#4A3B34] font-medium">
                          {item.contributor ? `By: ${item.contributor}` : 'Cultural Archive'}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => speakText(`${item.title}. ${item.description}`, e)}
                            className="p-1.5 rounded text-[#2D1E18]/70 hover:text-[#C05A3E] hover:bg-[#C05A3E]/10 transition-colors"
                            title="Listen Aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setActiveItemModal(item)}
                            className="px-3 py-1.5 rounded-md bg-[#2D1E18] text-[#D4AF37] hover:bg-[#1F1410] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:scale-105 transition-all shadow-xs"
                          >
                            Read Detail <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Cultural Item Detail Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-5">
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#2D1E18] text-[#D4AF37] hover:bg-[#1F1410] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="inline-block px-3 py-1 rounded-md bg-[#C05A3E] text-white text-xs font-bold uppercase tracking-wider">
                {activeItemModal.region === 'all' ? 'All Regions (Pan-Balochistan)' : `${activeItemModal.region} Balochistan`} • {categories.find((c) => c.id === activeItemModal.category)?.name || activeItemModal.category}
              </div>

              <button
                onClick={(e) => speakText(`${activeItemModal.title}. ${activeItemModal.description}`, e)}
                className="px-3 py-1 rounded-md bg-[#2D1E18] text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 hover:bg-[#1F1410]"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                {isSpeaking ? 'Stop Audio' : 'Listen Narrative'}
              </button>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1E18]">
              {activeItemModal.title}
            </h3>

            {activeItemModal.balochiTitle && (
              <div className="text-lg text-[#C05A3E] font-semibold italic">
                {activeItemModal.balochiTitle}
              </div>
            )}

            <p className="text-sm text-[#4A3B34] leading-relaxed">
              {activeItemModal.description}
            </p>

            {activeItemModal.details && activeItemModal.details.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#2D1E18]/15">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C05A3E]">
                  Key Cultural Aspects & Lore:
                </h4>
                <ul className="space-y-1.5 text-xs text-[#2D1E18] list-disc list-inside">
                  {activeItemModal.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Media Rendering (Audio or Image) */}
            {(activeItemModal.audioUrl || activeItemModal.mediaType === 'audio' || (activeItemModal.mediaUrl && (activeItemModal.mediaUrl.startsWith('data:audio') || activeItemModal.mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i) !== null))) ? (
              <div className="rounded-xl overflow-hidden border border-[#2D1E18]/20 mt-4 p-4 bg-[#1A100C] text-[#FAF4EB]">
                <div className="text-xs font-bold text-[#D4AF37] mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Audio Performance / Voice Recording Track:</span>
                </div>
                <audio controls src={activeItemModal.audioUrl || activeItemModal.mediaUrl} className="w-full rounded-lg bg-white" />
              </div>
            ) : activeItemModal.mediaUrl ? (
              <div className="rounded-xl overflow-hidden border border-[#2D1E18]/20 mt-4 max-h-72">
                <img
                  src={activeItemModal.mediaUrl}
                  alt={activeItemModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}

            <div className="pt-4 border-t border-[#2D1E18]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleBookmark(activeItemModal.id, e)}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                    bookmarkedIds.includes(activeItemModal.id)
                      ? 'bg-[#C05A3E]/10 border-[#C05A3E] text-[#C05A3E]'
                      : 'bg-white border-[#2D1E18]/20 text-[#2D1E18]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${bookmarkedIds.includes(activeItemModal.id) ? 'fill-[#C05A3E]' : ''}`} />
                  {bookmarkedIds.includes(activeItemModal.id) ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={(e) => handleOpenReportModal(activeItemModal, e)}
                  className="px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-700" />
                  Report
                </button>

                <button
                  onClick={(e) => handleOpenDeleteModal(activeItemModal, e)}
                  className="px-3 py-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                  Remove
                </button>
              </div>

              <button
                onClick={() => setActiveItemModal(null)}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#2D1E18] font-bold text-xs uppercase tracking-wider hover:shadow-md transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Harmful Content Modal */}
      {reportTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setReportTarget(null)}
              className="absolute top-4 right-4 p-1.5 rounded bg-[#2D1E18] text-[#D4AF37] hover:bg-[#1F1410]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Report Harmful Content
            </div>

            <p className="text-xs text-[#4A3B34] leading-relaxed">
              Help maintain a respectful archive. You are reporting: <strong className="text-[#2D1E18] font-bold">"{reportTarget.title}"</strong>
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold">Report Submitted Successfully</div>
                <p className="text-[11px] text-emerald-800">
                  Thank you for keeping our community safe. {reportAlsoHide ? 'This content has been hidden from your view.' : 'Our moderation team will review this entry.'}
                </p>
              </div>
            ) : (
              <form onSubmit={submitReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                    Select Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-white border border-[#2D1E18]/20 rounded-lg p-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none font-medium"
                  >
                    <option value="Hate Speech or Harassment">Hate Speech, Offensive, or Harassment</option>
                    <option value="Inappropriate Media">Inappropriate / Harmful Image or Audio</option>
                    <option value="Misinformation or Cultural Disrespect">Misinformation or Cultural Misattribution</option>
                    <option value="Copyright / Unauthorized Content">Copyright Violation or Unauthorized Post</option>
                    <option value="Spam or Unrelated Content">Spam or Unrelated Content</option>
                    <option value="Other Safety Issue">Other Safety Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
                    Additional Details <span className="text-[10px] text-[#4A3B34] font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any context to help moderation..."
                    className="w-full bg-white border border-[#2D1E18]/20 rounded-lg p-2.5 text-xs text-[#2D1E18] focus:border-[#C05A3E] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="reportHide"
                    checked={reportAlsoHide}
                    onChange={(e) => setReportAlsoHide(e.target.checked)}
                    className="w-4 h-4 accent-[#C05A3E] rounded cursor-pointer"
                  />
                  <label htmlFor="reportHide" className="text-xs text-[#2D1E18] font-medium cursor-pointer">
                    Also remove/hide this content immediately
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D1E18]/15">
                  <button
                    type="button"
                    onClick={() => setReportTarget(null)}
                    className="px-4 py-2 rounded-lg bg-white border border-[#2D1E18]/20 text-[#2D1E18] font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-sm w-full p-6 relative shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-300">
              <Trash2 className="w-6 h-6" />
            </div>

            <h4 className="font-serif text-lg font-bold text-[#2D1E18]">
              Remove Content?
            </h4>

            <p className="text-xs text-[#4A3B34] leading-relaxed">
              Are you sure you want to remove <strong className="text-[#2D1E18]">"{deleteTarget.title}"</strong> from the archive?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-white border border-[#2D1E18]/20 text-[#2D1E18] font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
