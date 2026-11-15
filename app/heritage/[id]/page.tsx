// NEW: full detail page for a story / song / recipe / embroidery / proverb
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { getHeritageItem, CATEGORY_NAMES } from '../../../lib/heritage';
import { HeritageDetailActions } from '../../../components/HeritageDetailActions';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getHeritageItem(decodeURIComponent(id));
  if (!item) return { title: 'Not found - Gul Zameen' };
  return { title: `${item.title} - Gul Zameen`, description: item.description.slice(0, 160) };
}

export default async function HeritagePage({ params }: Props) {
  const { id } = await params;
  const item = await getHeritageItem(decodeURIComponent(id));
  if (!item) notFound();

  const isAudio =
    Boolean(item.audioUrl) ||
    item.mediaType === 'audio' ||
    /\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i.test(item.mediaUrl || '');
  const isVideo = item.mediaType === 'video';
  const regionLabel =
    item.region === 'all' ? 'All Regions (Pan-Balochistan)' : `${item.region} Balochistan`;

  return (
    <main className="min-h-screen bg-[#F5E6D3] py-10 px-4">
      <article className="mx-auto max-w-3xl bg-[#FAF4EB] border-2 border-[#2D1E18] rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
        <Link
          href="/#regions"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D1E18] hover:text-[#A8452C]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <div className="inline-block px-3 py-1 rounded-md bg-[#A8452C] text-white text-xs font-bold uppercase tracking-wider">
          {regionLabel} • {CATEGORY_NAMES[item.category] || item.category}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1E18]">{item.title}</h1>
        {item.balochiTitle && (
          <div className="text-lg text-[#A8452C] font-semibold italic">{item.balochiTitle}</div>
        )}

        <HeritageDetailActions id={item.id} speech={`${item.title}. ${item.description}`} />

        <p className="text-base text-[#4A3B34] leading-relaxed">{item.description}</p>

        {item.translation && (
          <blockquote className="p-3 rounded-lg bg-white border-l-4 border-[#A8452C] text-sm text-[#2D1E18] italic">
            &quot;{item.translation}&quot;
          </blockquote>
        )}

        {item.details && item.details.length > 0 && (
          <section className="space-y-2 pt-4 border-t border-[#2D1E18]/15">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#A8452C]">
              Key Cultural Aspects &amp; Lore
            </h2>
            <ul className="space-y-2 text-sm text-[#2D1E18] list-disc list-inside">
              {item.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </section>
        )}

        {item.patternMotifs && item.patternMotifs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.patternMotifs.map((m, i) => (
              <span
                key={i}
                className="text-xs bg-white text-[#A8452C] font-semibold px-2 py-0.5 rounded border border-[#2D1E18]/10"
              >
                ❖ {m}
              </span>
            ))}
          </div>
        )}

        {isAudio ? (
          <div className="rounded-xl border border-[#2D1E18]/20 p-4 bg-[#1A100C] text-[#FAF4EB]">
            <div className="text-xs font-bold text-[#D4AF37] mb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Audio Performance / Recording
            </div>
            <audio controls src={item.audioUrl || item.mediaUrl} className="w-full" />
          </div>
        ) : isVideo && item.mediaUrl ? (
          <video controls src={item.mediaUrl} className="w-full rounded-xl border border-[#2D1E18]/20" />
        ) : item.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.mediaUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full max-h-[480px] object-cover rounded-xl border border-[#2D1E18]/20"
          />
        ) : null}

        <div className="pt-4 border-t border-[#2D1E18]/15 text-xs text-[#4A3B34]">
          {item.contributor ? `Shared by ${item.contributor}` : 'Gulzameen Cultural Archive'}
        </div>
      </article>
    </main>
  );
}
