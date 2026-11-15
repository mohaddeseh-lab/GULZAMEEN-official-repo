'use client';

// NEW: small "Translate into Balochi" tool with a tap-to-type Balochi letter keyboard
import React, { useRef, useState } from 'react';
import { Languages, Copy, Check, Loader2 } from 'lucide-react';

// Edit this list to match your Balochi keyboard (one string per key)
const BALOCHI_LETTERS = [
  'ا', 'آ', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ',
  'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ک', 'گ', 'ل', 'م', 'ن', 'ں', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے',
  'ۆ', 'ێ', 'ۏ', '،', '؟', '۔',
];

export const BalochiTranslator: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [detected, setDetected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const outRef = useRef<HTMLTextAreaElement>(null);

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

  // Types a tapped letter into the Balochi box at the cursor
  const insertLetter = (ch: string) => {
    const el = outRef.current;
    if (!el) return setOutput((o) => o + ch);
    const start = el.selectionStart ?? output.length;
    const end = el.selectionEnd ?? output.length;
    const next = output.slice(0, start) + ch + output.slice(end);
    setOutput(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
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
              ref={outRef}
              dir="rtl"
              lang="bal"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#2D1E18]/20 bg-[#FAF4EB] p-3 text-lg leading-loose text-[#2D1E18] focus:outline-none focus:border-[#A8452C]"
              style={{ fontFamily: "'Noto Nastaliq Urdu','Noto Naskh Arabic','Jameel Noori Nastaleeq',serif" }}
            />
          </div>

          <div>
            <div className="text-xs font-bold text-[#2D1E18] mb-1.5 uppercase tracking-wider">
              Balochi keyboard (tap to type into the Balochi box)
            </div>
            <div dir="rtl" className="flex flex-wrap gap-1.5">
              {BALOCHI_LETTERS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => insertLetter(ch)}
                  aria-label={`Letter ${ch}`}
                  className="w-9 h-9 rounded-md bg-[#FAF4EB] border border-[#2D1E18]/20 text-lg text-[#2D1E18] hover:bg-[#D4AF37]/30 active:scale-95"
                >
                  {ch}
                </button>
              ))}
              <button
                type="button"
                onClick={() => insertLetter(' ')}
                className="px-4 h-9 rounded-md bg-[#FAF4EB] border border-[#2D1E18]/20 text-xs font-bold text-[#2D1E18]"
              >
                Space
              </button>
              <button
                type="button"
                onClick={() => setOutput((o) => o.slice(0, -1))}
                className="px-4 h-9 rounded-md bg-[#FAF4EB] border border-[#2D1E18]/20 text-xs font-bold text-[#2D1E18]"
              >
                ⌫
              </button>
            </div>
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
