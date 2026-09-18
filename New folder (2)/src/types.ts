export type RegionId = 'eastern' | 'western' | 'southern' | 'all';

export type CategoryId = 'kissa' | 'saoth' | 'recipes' | 'baloch_duch' | 'bathal';

export interface CulturalItem {
  id: string;
  title: string;
  balochiTitle?: string;
  region: RegionId;
  category: CategoryId;
  description: string;
  details?: string[];
  audioUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'other';
  contributor?: string;
  createdAt: number; // timestamp ms
  featured?: boolean;
  patternMotifs?: string[];
  translation?: string; // For proverbs or stories
}

export interface RegionInfo {
  id: RegionId;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  climate: string;
  famousArt: string;
  mapCoordinates: { x: number; y: number; width: number; height: number };
}

export interface NetworkNode {
  id: string;
  label: string;
  balochiName?: string;
  category: 'core' | CategoryId | 'region';
  description: string;
  connections: string[]; // IDs of connected nodes
  iconName: string;
  x: number; // percentage pos
  y: number;
}

export interface Contribution {
  id: string;
  contributorName: string;
  region: RegionId;
  category: CategoryId;
  title: string;
  description: string;
  mediaUrl?: string;
  audioUrl?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'other';
  createdAt: number; // timestamp
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WordScrambleItem {
  id: number;
  scrambled: string;
  word: string;
  hint: string;
  meaning: string;
}

export interface FeedbackData {
  id: string;
  name: string;
  email: string;
  rating: number;
  suggestions: string;
  submittedAt: number;
}

export interface ContentReport {
  id: string;
  itemId: string;
  itemTitle: string;
  reason: string;
  additionalDetails?: string;
  reportedAt: number;
}

