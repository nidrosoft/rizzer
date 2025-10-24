/**
 * Favorites System Types
 */

export type FavoriteType = 'date_idea' | 'event' | 'hidden_gem' | 'date_plan';

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  description?: string;
  image?: string;
  savedAt: string;
  data: any; // Full item data
}

export interface FavoritesCollection {
  dateIdeas: FavoriteItem[];
  events: FavoriteItem[];
  hiddenGems: FavoriteItem[];
  datePlans: FavoriteItem[];
}

export interface FavoritesStats {
  total: number;
  dateIdeas: number;
  events: number;
  hiddenGems: number;
  datePlans: number;
}
