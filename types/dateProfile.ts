/**
 * Type definitions for Date Profile feature
 */

// Main Date Profile Interface
export interface DateProfileData {
  id: string;
  basicInfo: BasicInfo;
  stats: ProfileStats;
  interests: InterestData;
  notes: QuickNote[];
  photos: string[];
}

// Basic Information
export interface BasicInfo {
  name: string;
  age: number;
  birthday?: Date;
  profession: string;
  photo: string;
  status: RelationshipStatus;
  startDate: Date;
  howWeMet?: string;
}

export type RelationshipStatus = 'talking' | 'dating' | 'exclusive' | 'engaged';

// Profile Statistics
export interface ProfileStats {
  daysTogether: number;
  totalDates: number;
  memoriesCount: number;
}

// Interests & Preferences
export interface InterestData {
  hobbies: string[];
  favoriteThings: FavoriteThings;
  dislikes: string[];
  personality: string[];
}

export interface FavoriteThings {
  color?: string;
  flower?: string;
  food: string[];
  music: string[];
}

// Quick Notes
export interface QuickNote {
  id: string;
  content: string;
  createdAt: Date;
  style?: 'default' | 'important' | 'love' | 'idea' | 'reminder';
  category?: string;
}

// Category Card
export interface CategoryCard {
  id: string;
  title: string;
  icon: string;
  count: number;
  status?: 'complete' | 'incomplete';
  route: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  color: string;
}

// Component Props
export interface DateProfileHeaderProps {
  profile: DateProfileData;
  onBack: () => void;
  onEdit: () => void;
}

export interface QuickStatsBarProps {
  stats: ProfileStats;
}

export interface CategoryCardProps {
  category: CategoryCard;
  onPress: (categoryId: string) => void;
}

export interface InterestsCardProps {
  interests: InterestData;
  onEdit: () => void;
}

export interface QuickNotesCardProps {
  notes: QuickNote[];
  onAddNote: () => void;
  onEditNote: (noteId: string) => void;
}

export interface PhotoGalleryProps {
  photos: string[];
  onAddPhoto: (photoUris: string | string[]) => void;
  onViewPhoto: (photoIndex: number) => void;
}
