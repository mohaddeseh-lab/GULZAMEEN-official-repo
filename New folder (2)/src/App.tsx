import React, { useState, useEffect } from 'react';
import { CulturalItem, Contribution, RegionId, CategoryId, FeedbackData } from './types';
import { INITIAL_CULTURAL_ITEMS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CulturalHistory } from './components/CulturalHistory';
import { RegionExplorer } from './components/RegionExplorer';
import { NetworkGraph } from './components/NetworkGraph';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ContributionHub } from './components/ContributionHub';
import { GamesSection } from './components/GamesSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import {
  testFirestoreConnection,
  saveContributionToFirestore,
  saveFeedbackToFirestore,
  saveReportToFirestore,
  subscribeToContributions
} from './lib/firebase';

export default function App() {
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>(() => {
    const saved = localStorage.getItem('gz_cultural_items');
    if (saved) {
      try {
        const items: CulturalItem[] = JSON.parse(saved);
        const removedIds = new Set(['west-jalar', 'south-jalar', 'west-paliwar', 'east-paliwar', 'east-sabzu', 'south-sabzu']);
        return items.filter((item) => !removedIds.has(item.id));
      } catch (e) {
        console.error('Failed to parse saved cultural items', e);
      }
    }
    return INITIAL_CULTURAL_ITEMS;
  });

  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const saved = localStorage.getItem('gz_contributions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved contributions', e);
      }
    }
    return [];
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>(() => {
    const saved = localStorage.getItem('gz_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved feedbacks', e);
      }
    }
    return [];
  });

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [modalDefaultRegion, setModalDefaultRegion] = useState<RegionId>('eastern');
  const [modalDefaultCategory, setModalDefaultCategory] = useState<CategoryId>('kissa');

  // Initialize and validate Firestore connection on mount
  useEffect(() => {
    testFirestoreConnection();

    // Subscribe to live Firestore contributions
    const unsubscribe = subscribeToContributions((firestoreContribs) => {
      if (firestoreContribs && firestoreContribs.length > 0) {
        setContributions((prevLocal) => {
          const map = new Map<string, Contribution>();
          // Fill local first
          prevLocal.forEach((c) => map.set(c.id, c));
          // Override with remote firestore entries
          firestoreContribs.forEach((c) => map.set(c.id, c));
          return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
        });

        // Also add new items from Firestore to culturalItems explorer view
        firestoreContribs.forEach((contrib) => {
          const isAudio = Boolean(
            contrib.audioUrl ||
            contrib.mediaType === 'audio' ||
            (contrib.mediaUrl && (contrib.mediaUrl.startsWith('data:audio') || contrib.mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i) !== null))
          );
          const culturalId = `cultural-${contrib.id.replace('contrib-', '')}`;
          const newCulturalItem: CulturalItem = {
            id: culturalId,
            title: contrib.title,
            region: contrib.region,
            category: contrib.category,
            description: contrib.description,
            contributor: contrib.contributorName,
            createdAt: contrib.createdAt,
            mediaUrl: isAudio ? undefined : contrib.mediaUrl,
            audioUrl: isAudio ? (contrib.audioUrl || contrib.mediaUrl) : contrib.audioUrl,
            mediaType: isAudio ? 'audio' : contrib.mediaType
          };

          setCulturalItems((prevItems) => {
            if (prevItems.some((item) => item.id === culturalId)) return prevItems;
            return [newCulturalItem, ...prevItems];
          });
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Save changes to localStorage as backup
  useEffect(() => {
    localStorage.setItem('gz_cultural_items', JSON.stringify(culturalItems));
  }, [culturalItems]);

  useEffect(() => {
    localStorage.setItem('gz_contributions', JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem('gz_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleOpenContributeModal = (region?: RegionId, category?: CategoryId) => {
    if (region) setModalDefaultRegion(region);
    if (category) setModalDefaultCategory(category);
    setIsContributeModalOpen(true);
  };

  const handleAddContribution = async (newContrib: Omit<Contribution, 'id' | 'createdAt'>) => {
    const timestamp = Date.now();
    const newContribId = `contrib-${timestamp}`;

    const contributionObj: Contribution = {
      ...newContrib,
      id: newContribId,
      createdAt: timestamp
    };

    // Append to local contributions state
    setContributions((prev) => [contributionObj, ...prev]);

    // Save to Cloud Firestore Database!
    try {
      await saveContributionToFirestore(contributionObj);
    } catch (e) {
      console.warn('Persisted locally, cloud sync pending:', e);
    }

    // Also transform contribution into a new CulturalItem so it displays in region tab explorer immediately
    const isAudio = Boolean(
      newContrib.audioUrl || 
      newContrib.mediaType === 'audio' || 
      (newContrib.mediaUrl && (newContrib.mediaUrl.startsWith('data:audio') || newContrib.mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i) !== null))
    );

    const newCulturalItem: CulturalItem = {
      id: `cultural-${timestamp}`,
      title: newContrib.title,
      region: newContrib.region,
      category: newContrib.category,
      description: newContrib.description,
      contributor: newContrib.contributorName,
      createdAt: timestamp,
      mediaUrl: isAudio ? undefined : newContrib.mediaUrl,
      audioUrl: isAudio ? (newContrib.audioUrl || newContrib.mediaUrl) : newContrib.audioUrl,
      mediaType: isAudio ? 'audio' : newContrib.mediaType
    };

    setCulturalItems((prev) => [newCulturalItem, ...prev]);
  };

  const handleRemoveCulturalItem = (itemId: string) => {
    setCulturalItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleRemoveContribution = (contribId: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== contribId));
    // Also remove from cultural items if present
    setCulturalItems((prev) => prev.filter((item) => item.id !== `cultural-${contribId.replace('contrib-', '')}` && item.id !== contribId));
  };

  const handleReportContent = async (itemId: string, itemTitle: string, reason: string, details?: string) => {
    const newReport = {
      id: `report-${Date.now()}`,
      itemId,
      itemTitle,
      reason,
      additionalDetails: details || '',
      reportedAt: Date.now()
    };
    try {
      const existingReports = JSON.parse(localStorage.getItem('gz_content_reports') || '[]');
      localStorage.setItem('gz_content_reports', JSON.stringify([newReport, ...existingReports]));
      await saveReportToFirestore(newReport);
    } catch (e) {
      console.error('Failed to save content report', e);
    }
  };

  const handleAddFeedback = async (feedback: Omit<FeedbackData, 'id' | 'submittedAt'>) => {
    const newFeedbackObj: FeedbackData = {
      ...feedback,
      id: `fb-${Date.now()}`,
      submittedAt: Date.now()
    };
    setFeedbacks((prev) => [newFeedbackObj, ...prev]);
    try {
      await saveFeedbackToFirestore(newFeedbackObj);
    } catch (e) {
      console.warn('Feedback saved locally, cloud sync error:', e);
    }
  };

  // Calculate live real statistics without fake additions
  const storiesCount = culturalItems.filter((i) => i.category === 'kissa').length;
  const songsCount = culturalItems.filter((i) => i.category === 'saoth').length;
  const patternsCount = culturalItems.filter((i) => i.category === 'baloch_duch').length;

  return (
    <div className="min-h-screen bg-[#F9F4EE] text-[#2B231F] font-sans selection:bg-[#D4AF37] selection:text-[#1A100C]">
      
      {/* Header Navigation Bar */}
      <Navbar onOpenContributeModal={() => handleOpenContributeModal()} />

      {/* Hero Section */}
      <Hero
        onOpenContributeModal={() => handleOpenContributeModal()}
        statsCount={{
          stories: storiesCount,
          songs: songsCount,
          patterns: patternsCount,
          regions: 3
        }}
      />

      {/* Interactive Map & Region Overview (Cultural Archive Explorer) */}
      <RegionExplorer
        culturalItems={culturalItems}
        onOpenContributeModal={handleOpenContributeModal}
        onRemoveItem={handleRemoveCulturalItem}
        onReportItem={handleReportContent}
      />

      {/* Balochi Cultural History Section */}
      <CulturalHistory />

      {/* Cultural History Network Graph */}
      <NetworkGraph />

      {/* Community Growth Analytics */}
      <AnalyticsSection culturalItems={culturalItems} totalContributions={contributions.length} />

      {/* Dynamic Contribution Hub & Recent Submissions Feed */}
      <ContributionHub
        contributions={contributions}
        onSubmitContribution={handleAddContribution}
        onRemoveContribution={handleRemoveContribution}
        onReportContribution={handleReportContent}
        isOpenModal={isContributeModalOpen}
        onCloseModal={() => setIsContributeModalOpen(false)}
        defaultRegion={modalDefaultRegion}
        defaultCategory={modalDefaultCategory}
      />

      {/* Interactive Playable Mini-Games */}
      <GamesSection />

      {/* Feedback & Contact Form */}
      <FeedbackSection onAddFeedback={handleAddFeedback} />

      {/* Footer */}
      <Footer />

    </div>
  );
}
