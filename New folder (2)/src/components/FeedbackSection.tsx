import React, { useState } from 'react';
import { FeedbackData } from '../types';
import { MessageSquare, Star, Send, CheckCircle, Mail, User } from 'lucide-react';

interface FeedbackSectionProps {
  onAddFeedback: (feedback: Omit<FeedbackData, 'id' | 'submittedAt'>) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ onAddFeedback }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [suggestions, setSuggestions] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !suggestions) return;

    onAddFeedback({
      name,
      email,
      rating,
      suggestions
    });

    setShowToast(true);
    setName('');
    setEmail('');
    setRating(5);
    setSuggestions('');

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <section id="feedback" className="py-20 bg-[#F9F4EE] border-b-2 border-[#1A100C]/15 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A100C] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Feedback & Archival Inquiry</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A100C]">
            Help Shape Gulzameen
          </h2>
          <p className="text-sm text-[#2B231F] max-w-xl mx-auto">
            Your insights ensure our platform respects local traditions and cultural accuracy. Send your feedback directly to our editorial team.
          </p>
        </div>

        {/* Feedback Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#1A100C]/15 shadow-md relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rating Stars */}
            <div className="text-center pb-4 border-b border-[#1A100C]/15">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A100C] mb-2">
                Rate Your Experience on Gulzameen
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-[#1A100C]/20 fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#1A100C] mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-[#C2593F]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#C2593F] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Baloch / Jahan"
                    className="w-full bg-white border border-[#1A100C]/20 rounded pl-9 pr-3 py-2.5 text-xs text-[#2B231F] focus:border-[#C2593F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#1A100C] mb-1.5 uppercase tracking-wider">
                  Email Address <span className="text-[#C2593F]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#C2593F] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-white border border-[#1A100C]/20 rounded pl-9 pr-3 py-2.5 text-xs text-[#2B231F] focus:border-[#C2593F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-xs font-bold text-[#1A100C] mb-1.5 uppercase tracking-wider">
                Suggestions, Corrections, or Cultural Notes <span className="text-[#C2593F]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Share your thoughts on missing stories, dialect nuances, or platform features..."
                className="w-full bg-white border border-[#1A100C]/20 rounded p-3 text-xs text-[#2B231F] focus:border-[#C2593F] focus:outline-none"
              />
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#C2593F] to-[#9A3B1B] text-[#FAF4EE] font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Feedback to Site Administrator
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FAF4EE] border-2 border-[#1A100C] text-[#2B231F] p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-6 h-6 text-[#C2593F] flex-shrink-0" />
          <div>
            <div className="font-serif font-bold text-sm text-[#1A100C]">
              Feedback Delivered!
            </div>
            <div className="text-xs text-[#2B231F]/80">
              Routed to site administrator. Thank you for contributing!
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
