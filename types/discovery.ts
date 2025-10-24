/**
 * Discovery Feature Type Definitions
 */

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  image: string;
  category: DateIdeaCategory;
  difficulty: 'Easy' | 'Moderate' | 'Adventurous';
  budget: '$' | '$$' | '$$$';
  duration: string;
  bestTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  isIndoor: boolean;
  matchReason?: string;
  tags: string[];
  estimatedCost: string;
}

export type DateIdeaCategory = 
  | 'Romantic'
  | 'Adventure'
  | 'Cultural'
  | 'Food & Drink'
  | 'Active'
  | 'Creative'
  | 'Relaxing'
  | 'Entertainment';

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: EventCategory;
  price: string;
  priceValue: number;
  attendees: number;
  isDateFriendly: boolean;
  isSinglesWelcome: boolean;
  compatibilityScore?: number;
  tags: string[];
  organizer: string;
  distance?: string;
}

export type EventCategory =
  | 'Concerts'
  | 'Theater'
  | 'Art'
  | 'Food & Wine'
  | 'Sports'
  | 'Nightlife'
  | 'Festivals'
  | 'Workshops';

export interface HiddenGem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: HiddenGemCategory;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  isOpen: boolean;
  openingHours?: string;
  bestTimeToVisit: string;
  tags: string[];
  photos: string[];
  hasReservation: boolean;
  isInstagramWorthy: boolean;
}

export type HiddenGemCategory =
  | 'Scenic Views'
  | 'Cozy Cafés'
  | 'Restaurants'
  | 'Nature'
  | 'Photo Spots'
  | 'Creative Spaces'
  | 'Late Night'
  | 'Day Trips';

export interface DateItinerary {
  id: string;
  title: string;
  occasion: string;
  vibe: 'Romantic' | 'Fun' | 'Adventurous' | 'Chill';
  duration: string;
  totalCost: string;
  activities: ItineraryActivity[];
  startTime: string;
  endTime: string;
  route: string;
  backupPlan?: string;
}

export interface ItineraryActivity {
  id: string;
  order: number;
  title: string;
  location: string;
  duration: string;
  cost: string;
  description: string;
  time: string;
}

export interface FilterOptions {
  budget: string[];
  distance: string[];
  time: string[];
  vibe: string[];
  category: string[];
}

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
}

// Component Props
export interface DateIdeaCardProps {
  idea: DateIdea;
  onPress: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

export interface EventCardProps {
  event: Event;
  onPress: (id: string) => void;
  onInterested: (id: string) => void;
  onShare: (id: string) => void;
}

export interface HiddenGemCardProps {
  gem: HiddenGem;
  onPress: (id: string) => void;
  onSave: (id: string) => void;
  onGetDirections: (id: string) => void;
}

export interface ItineraryCardProps {
  itinerary: DateItinerary;
  onPress: (id: string) => void;
  onSend: (id: string) => void;
  onAddToCalendar: (id: string) => void;
}
