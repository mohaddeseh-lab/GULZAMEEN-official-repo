import React, { useState } from 'react';
import { NetworkNode } from '../types';
import { NETWORK_NODES } from '../data/initialData';
import { Share2, BookOpen, Music, Utensils, Sparkles, Quote, Landmark, X } from 'lucide-react';

export const NetworkGraph: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('core-1');
  const [selectedNodeModal, setSelectedNodeModal] = useState<NetworkNode | null>(null);

  const activeNode = NETWORK_NODES.find((n) => n.id === activeNodeId) || NETWORK_NODES[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'Music': return Music;
      case 'Utensils': return Utensils;
      case 'Sparkles': return Sparkles;
      case 'Quote': return Quote;
      default: return Landmark;
    }
  };

  return (
    <section id="network" className="py-20 bg-[#F5E6D3] border-t-2 border-b-2 border-[#2D1E18]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1E18] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Share2 className="w-3.5 h-3.5" />
            <span>Interactive Cultural History Network</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D1E18]">
            The Interconnected Web of Baloch Culture
          </h2>
          <p className="text-sm sm:text-base text-[#4A3B34]">
            Balochi oral folklore, desert melodies, needlework motifs, and culinary rituals form a unified heritage web. Click any node to reveal its interconnections.
          </p>
        </div>

        {/* Network Web Stage Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#2D1E18]/15 shadow-md relative overflow-hidden min-h-[520px] flex items-center justify-center max-w-5xl mx-auto">
          
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C05A3E" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {NETWORK_NODES.map((node) =>
              node.connections.map((targetId) => {
                const targetNode = NETWORK_NODES.find((n) => n.id === targetId);
                if (!targetNode) return null;
                const isConnectedToActive =
                  node.id === activeNodeId || targetId === activeNodeId;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isConnectedToActive ? '#C05A3E' : '#2D1E18'}
                    strokeWidth={isConnectedToActive ? '2.5' : '1'}
                    strokeDasharray={isConnectedToActive ? 'none' : '4 4'}
                    opacity={isConnectedToActive ? 0.9 : 0.25}
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Nodes Layer */}
          <div className="relative w-full h-[420px] z-10">
            {NETWORK_NODES.map((node) => {
              const IconComponent = getIcon(node.iconName);
              const isActive = node.id === activeNodeId;
              const isCore = node.category === 'core';
              const isConnected = activeNode.connections.includes(node.id) || isActive;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setActiveNodeId(node.id);
                    setSelectedNodeModal(node);
                  }}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                    isActive ? 'scale-125 z-30' : isConnected ? 'scale-105 z-20' : 'scale-95 opacity-70 z-10'
                  }`}
                >
                  {/* Glowing outer ring */}
                  <div
                    className={`relative rounded-full flex items-center justify-center p-3 shadow-md transition-all ${
                      isCore
                        ? 'w-16 h-16 bg-[#D4AF37] text-[#2D1E18] ring-4 ring-[#D4AF37]/40'
                        : isActive
                        ? 'w-14 h-14 bg-[#C05A3E] text-white ring-4 ring-[#D4AF37]'
                        : 'w-12 h-12 bg-[#2D1E18] text-[#D4AF37] border-2 border-[#D4AF37] hover:border-[#C05A3E]'
                    }`}
                  >
                    <IconComponent className={isCore ? 'w-8 h-8' : 'w-6 h-6'} />
                  </div>

                  {/* Node Label Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded bg-[#2D1E18] text-center whitespace-nowrap shadow-md">
                    <div className="text-xs font-bold font-serif text-[#F5E6D3]">
                      {node.label}
                    </div>
                    {node.balochiName && (
                      <div className="text-[10px] text-[#D4AF37] font-semibold">
                        {node.balochiName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Node Detail Popup Modal */}
      {selectedNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedNodeModal(null)}
              className="absolute top-4 right-4 p-2 rounded bg-[#2D1E18] text-[#D4AF37] hover:bg-[#1F1410]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-[#C05A3E]">
              Cultural Network Node
            </span>

            <h3 className="font-serif text-2xl font-bold text-[#2D1E18]">
              {selectedNodeModal.label}
            </h3>

            {selectedNodeModal.balochiName && (
              <p className="text-sm font-semibold text-[#C05A3E]">
                {selectedNodeModal.balochiName}
              </p>
            )}

            <p className="text-xs text-[#4A3B34] leading-relaxed">
              {selectedNodeModal.description}
            </p>

            <div className="pt-3 border-t border-[#2D1E18]/15 flex justify-end">
              <button
                onClick={() => setSelectedNodeModal(null)}
                className="px-4 py-2 rounded bg-[#D4AF37] text-[#2D1E18] text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
