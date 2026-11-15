'use client';

// NEW: Save + Listen buttons for the heritage detail page
import React, { useEffect, useState } from 'react';
import { Heart, Volume2 } from 'lucide-react';

export function HeritageDetailActions({ id, speech }: { id: string; speech: string }) {
  const [saved, setSaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('gz_bookmarked_ids') || '[]');
      setSaved(ids.includes(id));
    } catch {}
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [id]);

  const toggleSave = () => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('gz_bookmarked_ids') || '[]');
      const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
      localStorage.setItem('gz_bookmarked_ids', JSON.stringify(next));
      setSaved(next.includes(id));
    } catch {}
  };

  const toggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(speech);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={toggleSpeak}
        className="px-3.5 py-2 rounded-lg bg-[#2D1E18] text-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1F1410]"
      >
        <Volume2 className="w-3.5 h-3.5" />
        {speaking ? 'Stop Audio' : 'Listen Narrative'}
      </button>
      <button
        onClick={toggleSave}
        className={`px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border transition-colors ${
          saved
            ? 'bg-[#A8452C]/10 border-[#A8452C] text-[#A8452C]'
            : 'bg-white border-[#2D1E18]/20 text-[#2D1E18]'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-[#A8452C]' : ''}`} />
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  );
}
