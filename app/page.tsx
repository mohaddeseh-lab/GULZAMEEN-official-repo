'use client';

import { useState, useEffect } from 'react';
import { CulturalItem, Contribution, RegionId, CategoryId, FeedbackData } from '../lib/types';
import { INITIAL_CULTURAL_ITEMS } from '../lib/initialData';
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

// Saves to the visitor's own browser. Never crashes if storage is full or blocked.
function saveLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Could not save', key, e);
  }
}

function isAudioMedia(c: { audioUrl?: string; mediaType?: string; mediaUrl?: string }) {
  return Boolean(
    c.audioUrl ||
      c.mediaType === 'audio' ||
      (c.mediaUrl &&
        (c.mediaUrl.startsWith('data:audio') ||
          /\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i.test(c.mediaUrl)))
  );
}

export default function Home() {
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>(INITIAL_CULTURAL_ITEMS);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [modalDefaultRegion, setModalDefaultRegion] = useState<RegionId>('eastern');
  const [modalDefaultCategory, setModalDefaultCategory] = useState<CategoryId>('kissa');

  // Load anything this visitor saved earlier (runs after the page appears)
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('gz_cultural_items_v1');
      if (savedItems) setCulturalItems(JSON.parse(savedItems));
      const savedContribs = localStorage.getItem('gz_contributions_v1');
      if (savedContribs) setContributions(JSON.parse(savedContribs));
      const savedFeedbacks = localStorage.getItem('gz_feedbacks_v1');
      if (savedFeedbacks) setFeedbacks(JSON.parse(savedFeedbacks));
    } catch (e) {
      console.error('Could not read saved data', e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveLocal('gz_cultural_items_v1', culturalItems);
  }, [culturalItems, loaded]);

  useEffect(() => {
    if (loaded) saveLocal('gz_contributions_v1', contributions);
  }, [contributions, loaded]);

  useEffect(() => {
    if (loaded) saveLocal('gz_feedbacks_v1', feedbacks);
  }, [feedbacks, loaded]);

  const handleOpenContributeModal = (region?: RegionId, category?: CategoryId) => {
    if (region) setModalDefaultRegion(region);
    if (category) setModalDefaultCategory(category);
    setIsContributeModalOpen(true);
  };

  const handleAddContribution = (newContrib: Omit<Contribution, 'id' | 'createdAt'>) => {
    const timestamp = Date.now();
    const contributionObj: Contribution = {
      ...newContrib,
      id: `contrib-${timestamp}`,
      createdAt: timestamp,
    };
    setContributions((prev) => [contributionObj, ...prev]);

    // TODO (phase 3): also save this contribution to Supabase

    const audio = isAudioMedia(newContrib);
    const newCulturalItem: CulturalItem = {
      id: `cultural-${timestamp}`,
      title: newContrib.title,
      region: newContrib.region,
      category: newContrib.category,
      description: newContrib.description,
      contributor: newContrib.contributorName,
      createdAt: timestamp,
      mediaUrl: audio ? undefined : newContrib.mediaUrl,
      audioUrl: audio ? newContrib.audioUrl || newContrib.mediaUrl : newContrib.audioUrl,
      mediaType: audio ? 'audio' : newContrib.mediaType,
    };
    setCulturalItems((prev) => [newCulturalItem, ...prev]);
  };

  const handleRemoveCulturalItem = (itemId: string) => {
    setCulturalItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleRemoveContribution = (contribId: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== contribId));
    setCulturalItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== `cultural-${contribId.replace('contrib-', '')}` && item.id !== contribId
      )
    );
  };

  const handleReportContent = (
    itemId: string,
    itemTitle: string,
    reason: string,
    details?: string
  ) => {
    const newReport = {
      id: `report-${Date.now()}`,
      itemId,
      itemTitle,
      reason,
      additionalDetails: details || '',
      reportedAt: Date.now(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('gz_content_reports') || '[]');
      localStorage.setItem('gz_content_reports', JSON.stringify([newReport, ...existing]));
    } catch (e) {
      console.error('Failed to save content report', e);
    }
    // TODO (phase 3): also save this report to Supabase so it shows up on the admin page
  };

  const handleAddFeedback = (feedback: Omit<FeedbackData, 'id' | 'submittedAt'>) => {
    const newFeedbackObj: FeedbackData = {
      ...feedback,
      id: `fb-${Date.now()}`,
      submittedAt: Date.now(),
    };
    setFeedbacks((prev) => [newFeedbackObj, ...prev]);
    // TODO (phase 3): also save this feedback to Supabase
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