/**
 * Data for Date Profile feature
 */

import { DateProfileData, CategoryCard } from '@/types/dateProfile';

// Sample date profile data
export const sampleDateProfile: DateProfileData = {
  id: '2',
  basicInfo: {
    name: 'Sarah',
    age: 26,
    birthday: new Date('1998-05-15'),
    profession: 'Hair Braider',
    photo: 'https://i.pravatar.cc/150?img=5',
    status: 'dating',
    startDate: new Date('2024-07-21'),
    howWeMet: 'Met at a coffee shop downtown',
  },
  stats: {
    daysTogether: 92,
    totalDates: 15,
    memoriesCount: 48,
  },
  interests: {
    hobbies: ['Photography', 'Yoga', 'Cooking', 'Traveling'],
    favoriteThings: {
      color: 'Lavender',
      flower: 'Sunflowers',
      food: ['Italian', 'Sushi', 'Thai'],
      music: ['R&B', 'Jazz', 'Indie Pop'],
    },
    dislikes: ['Spicy food', 'Horror movies', 'Cold weather'],
    personality: ['Creative', 'Adventurous', 'Caring', 'Spontaneous'],
  },
  notes: [
    {
      id: '1',
      content: 'Loves surprise picnics in the park',
      createdAt: new Date('2024-08-10'),
      category: 'preferences',
    },
    {
      id: '2',
      content: 'Allergic to peanuts - important!',
      createdAt: new Date('2024-07-25'),
      category: 'health',
    },
    {
      id: '3',
      content: 'Wants to visit Japan next year',
      createdAt: new Date('2024-09-05'),
      category: 'goals',
    },
  ],
  photos: [
    'https://i.pravatar.cc/300?img=5',
    'https://i.pravatar.cc/300?img=10',
    'https://i.pravatar.cc/300?img=20',
    'https://i.pravatar.cc/300?img=32',
  ],
};

// Category cards for the main profile screen
export const profileCategories: CategoryCard[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '📋',
    count: 1,
    status: 'complete',
    route: '/date-profile/overview',
    bgColor: '#FFF5F7',
    borderColor: '#FFE0E8',
    iconBg: '#FFD1DC',
    color: '#FF6B9D',
  },
  {
    id: 'interests',
    title: 'Interests',
    icon: '❤️',
    count: 12,
    status: 'complete',
    route: '/date-profile/interests',
    bgColor: '#FFF0F5',
    borderColor: '#FFD6E7',
    iconBg: '#FFC1DC',
    color: '#E91E63',
  },
  {
    id: 'dates',
    title: 'Dates & Events',
    icon: '📅',
    count: 15,
    status: 'incomplete',
    route: '/date-profile/dates',
    bgColor: '#F3F0FF',
    borderColor: '#E0D6FF',
    iconBg: '#D1C1FF',
    color: '#8B5CF6',
  },
  {
    id: 'memories',
    title: 'Memories',
    icon: '📸',
    count: 48,
    status: 'incomplete',
    route: '/date-profile/memories',
    bgColor: '#FFF9F0',
    borderColor: '#FFECD6',
    iconBg: '#FFDDB3',
    color: '#FF9800',
  },
  {
    id: 'conversations',
    title: 'Conversations',
    icon: '💬',
    count: 8,
    status: 'incomplete',
    route: '/date-profile/conversations',
    bgColor: '#F0F9FF',
    borderColor: '#D6ECFF',
    iconBg: '#B3DCFF',
    color: '#2196F3',
  },
  {
    id: 'gifts',
    title: 'Gifts & Ideas',
    icon: '🎁',
    count: 5,
    status: 'incomplete',
    route: '/date-profile/gifts',
    bgColor: '#FFF0F9',
    borderColor: '#FFD6EC',
    iconBg: '#FFC1DD',
    color: '#EC4899',
  },
  {
    id: 'favorites',
    title: 'Favorites',
    icon: '🍽️',
    count: 10,
    status: 'incomplete',
    route: '/date-profile/favorites',
    bgColor: '#F0FFF4',
    borderColor: '#D6FFE4',
    iconBg: '#B3F5D1',
    color: '#10B981',
  },
  {
    id: 'notes',
    title: 'Quick Notes',
    icon: '📝',
    count: 3,
    status: 'incomplete',
    route: '/date-profile/notes',
    bgColor: '#FFFBF0',
    borderColor: '#FFF4D6',
    iconBg: '#FFEAB3',
    color: '#F59E0B',
  },
];

// Helper functions
export const getDateProfile = (id: string): DateProfileData => {
  // In production, this would fetch from API/database
  return sampleDateProfile;
};

export const getProfileCategories = (): CategoryCard[] => profileCategories;

export const calculateDaysTogether = (startDate: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getRelationshipStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    'Just Met': 'Just Met',
    'Talking': 'Talking',
    'Dating': 'Dating',
    'Serious': 'Serious',
    'Engaged': 'Engaged',
    'Married': 'Married',
    'Divorced': 'Divorced',
    // Legacy values (lowercase)
    'just met': 'Just Met',
    'talking': 'Talking',
    'dating': 'Dating',
    'serious': 'Serious',
    'engaged': 'Engaged',
    'married': 'Married',
    'divorced': 'Divorced',
    'exclusive': 'Serious',
  };
  return labels[status] || status || 'Dating';
};
