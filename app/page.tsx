'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CulturalItem, Contribution, ContributionStatus, RegionId, CategoryId, FeedbackData } from '../lib/types';
import { INITIAL_CULTURAL_ITEMS } from '../lib/initialData';
import { supabase } from '../lib/supabase';
import { rowToItem, FileRow } from '../lib/heritage';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';

// CHANGED: sections below the first screen are loaded as separate chunks, so the first
// screen has much less JavaScript to run (this is what lowers "Total Blocking Time").
const RegionExplorer = dynamic(() => import('../components/RegionExplorer').then((m) => m.RegionExplorer));
const CulturalHistory = dynamic(() => import('../components/CulturalHistory').then((m) => m.CulturalHistory));
const NetworkGraph = dynamic(() => import('../components/NetworkGraph').then((m) => m.NetworkGraph));
const AnalyticsSection = dynamic(() => import('../components/AnalyticsSection').then((m) => m.AnalyticsSection));
const ContributionHub = dynamic(() => import('../components/ContributionHub').then((m) => m.ContributionHub));
const GamesSection = dynamic(() => import('../components/GamesSection').then((m) => m.GamesSection));
const FeedbackSection = dynamic(() => import('../components/FeedbackSection').then((m) => m.FeedbackSection));
const BalochiTranslator = dynamic(() => import('../components/BalochiTranslator').then((m) => m.BalochiTranslator));
const Footer = dynamic(() => import('../components/Footer').then((m) => m.Footer));

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;

// Saves to the visitor's own browser. Never crashes if storage is full or blocked.
function saveLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Could not save', key, e);
  }
}

async function postSubmit(payload: Record<string, unknown>) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Sends a media file picked in the browser (a data: URL) to R2
async function uploadMedia(dataUrl: string) {
  const blob = await (await fetch(dataUrl)).blob();
  const mimeType = blob.type.split(';')[0];
  if (blob.size > MAX_MEDIA_SIZE) throw new Error('File too large (max 50MB)');
  const filename = `contribution.${mimeType.split('/')[1] || 'bin'}`;

  const res = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType: mimeType, size: blob.size }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');

  const put = await fetch(data.url, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': mimeType },
  });
  if (!put.ok) throw new Error('Upload failed');

  return { r2Key: data.key as string, mimeType, size: blob.size, filename };
}

export default function Home() {
  const [approvedItems, setApprovedItems] = useState<CulturalItem[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [modalDefaultRegion, setModalDefaultRegion] = useState<RegionId>('eastern');
  const [modalDefaultCategory, setModalDefaultCategory] = useState<CategoryId>('kissa');

  // This visitor's own submissions list (kept in their browser)
  useEffect(() => {
    try {
      const savedContribs = localStorage.getItem('gz_contributions_v1');
      if (savedContribs) setContributions(JSON.parse(savedContribs));
    } catch (e) {
      console.error('Could not read saved data', e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    // CHANGED: never store big data: URLs (photo/audio bytes) in localStorage, it overflows
    if (loaded) {
      saveLocal(
        'gz_contributions_v1',
        contributions.map((c) => ({
          ...c,
          mediaUrl: c.mediaUrl?.startsWith('data:') ? undefined : c.mediaUrl,
          audioUrl: c.audioUrl?.startsWith('data:') ? undefined : c.audioUrl,
        }))
      );
    }
  }, [contributions, loaded]);

  // Everyone sees the contributions the admin has approved
  useEffect(() => {
    async function loadApproved() {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('status', 'approved')
        .not('title', 'is', null)
        .order('created_at', { ascending: false });
      if (error || !data) {
        console.error('Could not load approved items', error);
        return;
      }
      setApprovedItems((data as FileRow[]).map(rowToItem));
    }
    loadApproved();
  }, []);

  // NEW: keep each of this visitor's submissions in step with its real status
  // (pending / approved / removed) instead of always showing "Verified".
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;

    async function syncStatuses() {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      const ids = contributions.map((c) => c.serverId).filter((id): id is string => Boolean(id));
      let statuses: Record<string, ContributionStatus> = {};
      if (ids.length > 0) {
        try {
          const res = await fetch('/api/contribution-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
          });
          if (res.ok) statuses = (await res.json()).statuses || {};
        } catch {
          return; // offline or network error: keep what we have
        }
      }
      if (cancelled) return;

      setContributions((prev) => {
        let changed = false;
        const next = prev.map((c) => {
          // Older entries saved before this fix have no server id: match them to an
          // approved item with the same title and contributor name.
          if (!c.serverId) {
            const match = approvedItems.find(
              (a) =>
                a.title.trim().toLowerCase() === c.title.trim().toLowerCase() &&
                (a.contributor || 'Anonymous') === (c.contributorName || 'Anonymous')
            );
            if (match) {
              changed = true;
              return { ...c, serverId: match.id, status: 'approved' as ContributionStatus };
            }
            return c.status ? c : { ...c, status: 'pending' as ContributionStatus };
          }
          const status = statuses[c.serverId];
          if (status && status !== c.status) {
            changed = true;
            return { ...c, status };
          }
          return c;
        });
        return changed ? next : prev;
      });
    }

    syncStatuses();
    const onVisible = () => {
      if (document.visibilityState === 'visible') syncStatuses();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', syncStatuses);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', syncStatuses);
    };
    // Re-run when the list of server ids or the approved items change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, approvedItems, contributions.map((c) => c.serverId ?? '').join(',')]);

  const culturalItems: CulturalItem[] = [...approvedItems, ...INITIAL_CULTURAL_ITEMS];

  const handleOpenContributeModal = (region?: RegionId, category?: CategoryId) => {
    if (region) setModalDefaultRegion(region);
    if (category) setModalDefaultCategory(category);
    setIsContributeModalOpen(true);
  };

  // CHANGED: returns an error message (or null on success) so the form can show the
  // success card only when the upload really worked. No more browser alert() popups.
  const handleAddContribution = async (
    newContrib: Omit<Contribution, 'id' | 'createdAt'>
  ): Promise<string | null> => {
    let serverId: string | undefined;
    try {
      const source = newContrib.audioUrl || newContrib.mediaUrl;
      const media = source && source.startsWith('data:') ? await uploadMedia(source) : null;
      const result = await postSubmit({
        type: 'contribution',
        title: newContrib.title,
        description: newContrib.description,
        contributorName: newContrib.contributorName,
        region: newContrib.region,
        category: newContrib.category,
        r2Key: media?.r2Key,
        mimeType: media?.mimeType,
        size: media?.size,
        filename: media?.filename,
      });
      serverId = result.id;
    } catch (e) {
      console.error(e);
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return 'You are offline. Please reconnect to the internet and try again.';
      }
      return e instanceof Error ? e.message : 'Could not submit. Please try again.';
    }

    const timestamp = Date.now();
    const contributionObj: Contribution = {
      ...newContrib,
      id: `contrib-${timestamp}`,
      serverId,
      status: 'pending',
      createdAt: timestamp,
    };
    setContributions((prev) => [contributionObj, ...prev]);
    return null;
  };

  const handleRemoveCulturalItem = () => {
    window.alert(
      'Items can only be removed by the site moderators. If something is wrong, please use the report button.'
    );
  };

  // Removes the entry from this visitor's own list only
  const handleRemoveContribution = (contribId: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== contribId));
  };

  const handleReportContent = (
    itemId: string,        
    itemTitle: string,
    reason: string,
    details?: string
  ) => {
    postSubmit({ type: 'report', itemId, itemTitle, reason, details }).catch((e) =>
      console.error('Could not send report', e)
    );
  };

  const handleAddFeedback = (feedback: Omit<FeedbackData, 'id' | 'submittedAt'>) => {
    postSubmit({
      type: 'feedback',
      name: feedback.name,
      email: feedback.email,
      rating: feedback.rating,
      suggestions: feedback.suggestions,
    }).catch((e) => console.error('Could not send feedback', e));
  };

  const storiesCount = culturalItems.filter((i) => i.category === 'kissa').length;
  const songsCount = culturalItems.filter((i) => i.category === 'saoth').length;
  const patternsCount = culturalItems.filter((i) => i.category === 'baloch_duch').length;

  return (
    <div className="min-h-screen bg-[#F9F4EE] text-[#2B231F] font-sans selection:bg-[#D4AF37] selection:text-[#1A100C]">
      <Navbar onOpenContributeModal={() => handleOpenContributeModal()} />

      <Hero
        onOpenContributeModal={() => handleOpenContributeModal()}
        statsCount={{
          stories: storiesCount,
          songs: songsCount,
          patterns: patternsCount,
          regions: 3,
        }}
      />

      <RegionExplorer
        culturalItems={culturalItems}
        onOpenContributeModal={handleOpenContributeModal}
        onRemoveItem={handleRemoveCulturalItem}
        onReportItem={handleReportContent}
      />

      <CulturalHistory />

      <NetworkGraph />

      <AnalyticsSection culturalItems={culturalItems} totalContributions={contributions.length} />

      <ContributionHub
        contributions={contributions}
        onSubmitContribution={handleAddContribution}
        onRemoveContribution={handleRemoveContribution}
        onReportContribution={handleReportContent}
        onOpenModal={() => handleOpenContributeModal()}
        isOpenModal={isContributeModalOpen}
        onCloseModal={() => setIsContributeModalOpen(false)}
        defaultRegion={modalDefaultRegion}
        defaultCategory={modalDefaultCategory}
      />

      <BalochiTranslator />

      <GamesSection />

      <FeedbackSection onAddFeedback={handleAddFeedback} />

      <Footer />
    </div>
  );
}