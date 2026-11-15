// NEW: shared helpers so the home page and the new detail page build items the same way
import { CulturalItem, RegionId, CategoryId } from './types';
import { INITIAL_CULTURAL_ITEMS } from './initialData';
import { supabase } from './supabase';

export interface FileRow {
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
export function rowToItem(row: FileRow): CulturalItem {
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

// Finds one item: built-in items first, then approved community items from Supabase
export async function getHeritageItem(id: string): Promise<CulturalItem | null> {
  const builtIn = INITIAL_CULTURAL_ITEMS.find((i) => i.id === id);
  if (builtIn) return builtIn;

  const { data } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .not('title', 'is', null)
    .maybeSingle();
  return data ? rowToItem(data as FileRow) : null;
}

export const CATEGORY_NAMES: Record<CategoryId, string> = {
  kissa: 'Folk Stories',
  saoth: 'Music',
  recipes: 'Recipes',
  baloch_duch: 'Embroidery',
  bathal: 'Proverbs',
};
