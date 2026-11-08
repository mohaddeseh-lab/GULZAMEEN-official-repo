'use client';

import { useState, useEffect } from 'react';
import { CulturalItem, Contribution, RegionId, CategoryId, FeedbackData } from '../lib/types';
import { INITIAL_CULTURAL_ITEMS } from '../lib/initialData';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { RegionExplorer } from '../components/RegionExplorer';
import { CulturalHistory } from '../components/CulturalHistory';
import { NetworkGraph } from '../components/NetworkGraph';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { ContributionHub } from '../components/ContributionHub';
import { GamesSection } from '../components/GamesSection';
import { FeedbackSection } from '../components/FeedbackSection';
import { Footer } from '../components/Footer';

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;

interface FileRow {
  id: string;
  title: string | null;
  description: string | null;
  contributor_name: string | null;
  region: RegionId | null;
  category: CategoryId | null;
  r2_key: string | null;
  mime_type: string | null;
  created_at: string;
}

// Turns an approved Supabase row into the shape the page components expect
function rowToItem(row: FileRow): CulturalItem {
  const mime = row.mime_type || '';
  const hasMedia = Boolean(row.r2_key);
  const link = `/api/media/${row.id}`;
  const isAudio = mime.startsWith('audio/');
  return {
    id: row.id,
    title: row.title || '',
    region: row.region || 'all',
    category: row.category || 'kissa',
    description: row.description || '',
    contributor: row.contributor_name || 'Anonymous',
    createdAt: new Date(row.created_at).getTime(),
    audioUrl: hasMedia && isAudio ? link : undefined,
    mediaUrl: hasMedia && !isAudio ? link : undefined,
    mediaType: !hasMedia
      ? undefined
      : isAudio
        ? 'audio'
        : mime.startsWith('video/')
          ? 'video'
          : mime.startsWith('image/')
            ? 'image'
            : 'other',
  };
}

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
    if (loaded) saveLocal('gz_contributions_v1', contributions);
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

  const culturalItems: CulturalItem[] = [...approvedItems, ...INITIAL_CULTURAL_ITEMS];

  const handleOpenContributeModal = (region?: RegionId, category?: CategoryId) => {
    if (region) setModalDefaultRegion(region);
    if (category) setModalDefaultCategory(category);
    setIsContributeModalOpen(true);
  };

  const handleAddContribution = async (newContrib: Omit<Contribution, 'id' | 'createdAt'>) => {
    try {
      const source = newContrib.audioUrl || newContrib.mediaUrl;
      const media = source && source.startsWith('data:') ? await uploadMedia(source) : null;
      await postSubmit({
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
    } catch (e) {
      console.error(e);
      window.alert(e instanceof Error ? e.message : 'Could not submit. Please try again.');
      return;
    }

    const timestamp = Date.now();
    const contributionObj: Contribution = {
      ...newContrib,
      id: `contrib-${timestamp}`,
      createdAt: timestamp,
    };
    setContributions((prev) => [contributionObj, ...prev]);
    window.alert('Thank you! Your contribution was sent and will appear on the site after review.');
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

      <GamesSection />

      <FeedbackSection onAddFeedback={handleAddFeedback} />

      <Footer />
    </div>
  );
}