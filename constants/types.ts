// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: Date;
  zodiacSign?: string;
  gender?: string;
  location?: string;
  bio?: string;
  photos?: string[];
  interests?: string[];
  isPremium: boolean;
  createdAt: Date;
}

// Rizz Types
export interface Rizz {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: RizzCategory;
  emoji: string;
  color: string;
  createdAt: Date;
  isFavorite: boolean;
}

export type RizzCategory = 
  | 'conversation_starters'
  | 'compliments'
  | 'icebreakers'
  | 'flirty'
  | 'funny';

// Date Profile Types
export interface DateProfile {
  id: string;
  userId: string;
  name: string;
  age?: number;
  photos?: string[];
  howWeMet?: string;
  interests?: string[];
  preferences?: string[];
  contactInfo?: ContactInfo;
  notes?: string;
  lastInteraction?: Date;
  createdAt: Date;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    snapchat?: string;
  };
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: Date;
  location: string;
  category: EventCategory;
  attendeeCount: number;
  isInterested: boolean;
}

export type EventCategory = 
  | 'parties'
  | 'networking'
  | 'sports'
  | 'culture'
  | 'other';

// Onboarding Types
export interface OnboardingData {
  name?: string;
  dateOfBirth?: Date;
  zodiacSign?: string;
  primaryGoal?: string;
  location?: string;
  relationshipStatus?: string;
  gender?: string;
  lookingFor?: string[];
  height?: number;
  education?: string;
  work?: {
    title?: string;
    company?: string;
  };
  interests?: string[];
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    fitness?: string;
  };
  values?: {
    political?: string;
    religion?: string;
    familyPlans?: string;
  };
  photos?: string[];
  bio?: string;
}

// Navigation Types
export type RootStackParamList = {
  index: undefined;
  splash: undefined;
  onboarding: undefined;
  auth: undefined;
  tabs: undefined;
};

export type AuthStackParamList = {
  welcome: undefined;
  signup: undefined;
  signin: undefined;
  phone: undefined;
  otp: { phoneNumber: string };
};

export type OnboardingStackParamList = {
  name: undefined;
  dateOfBirth: undefined;
  zodiacSign: undefined;
  primaryGoal: undefined;
  location: undefined;
  relationshipStatus: undefined;
  gender: undefined;
  lookingFor: undefined;
  height: undefined;
  education: undefined;
  work: undefined;
  interests: undefined;
  lifestyle: undefined;
  values: undefined;
  photos: undefined;
  bio: undefined;
  verification: undefined;
};

export type TabsParamList = {
  home: undefined;
  rizz: undefined;
  dates: undefined;
  discovery: undefined;
};
