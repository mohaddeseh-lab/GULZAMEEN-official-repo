'use client';

// NEW: small "Translate into Balochi" tool
import React, { useState } from 'react';
import { Languages, Copy, Check, Loader2 } from 'lucide-react';

export const BalochiTranslator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [detected, setDetected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!input.trim() || loading) return;
    if (!navigator.onLine) {
      setError('You are offline. Please reconnect to translate.');
      return;
    }
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Translation failed');
      setOutput(data.translation);
      setDetected(data.detectedLanguage || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section id="translator" className="py-16 bg-[#F9F4EE] border-b-2 border-[#2D1E18]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1E18] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Languages className="w-3.5 h-3.5" />
            <span>Balochi Translator</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1E18]">
            Translate into Balochi
          </h2>
          <p className="text-sm text-[#4A3B34]">
            Type in any language. The language is detected automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#2D1E18]/15 shadow-md space-y-4">
          <div>
            <label htmlFor="tr-in" className="block text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
              Your text
            </label>
            <textarea
              id="tr-in"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Type or paste text here..."
              className="w-full rounded-lg border border-[#2D1E18]/20 bg-[#FAF4EB] p-3 text-sm text-[#2D1E18] focus:outline-none focus:border-[#A8452C]"
            />
            <div className="text-[11px] text-[#4A3B34] text-right">{input.length}/1000</div>
          </div>

          <button
            onClick={translate}
            disabled={loading || !input.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2D1E18] text-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-[#1F1410] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
            {loading ? 'Translating...' : 'Translate to Balochi'}
          </button>

          {error && (
            <p role="alert" className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded p-2.5">
              {error}
            </p>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="tr-out" className="text-xs font-bold text-[#2D1E18] uppercase tracking-wider">
                Balochi {detected && <span className="font-normal normal-case text-[#4A3B34]">(from {detected})</span>}
              </label>
              <button
                onClick={copy}
                disabled={!output}
                aria-label="Copy Balochi text"
                className="text-xs font-bold text-[#A8452C] flex items-center gap-1 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              id="tr-out"
              dir="rtl"
              lang="bal"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#2D1E18]/20 bg-[#FAF4EB] p-3 text-lg leading-loose text-[#2D1E18] focus:outline-none focus:border-[#A8452C]"
              style={{ fontFamily: "'Noto Nastaliq Urdu','Noto Naskh Arabic','Jameel Noori Nastaleeq',serif" }}
            />
          </div>

          <p className="text-[11px] text-[#4A3B34] leading-relaxed border-t border-[#2D1E18]/10 pt-3">
            Machine translation into Balochi is still limited and can be wrong. Please have a native
            speaker check anything important, and edit the result above if needed.
          </p>
        </div>
      </div>
    </section>
  );
};
