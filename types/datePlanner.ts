/**
 * AI Date Planner Types
 */

export interface DatePlanPreferences {
  occasion: string;
  vibe: string;
  budget: string;
  duration: string;
  location?: string;
  dietaryRestrictions?: string[];
  interests?: string[];
}

export interface ItineraryActivity {
  id: string;
  time: string;
  duration: string;
  title: string;
  description: string;
  category: 'food' | 'activity' | 'entertainment' | 'relaxation';
  location: string;
  address: string;
  estimatedCost: string;
  image: string;
  tips?: string[];
  reservationRequired?: boolean;
}

export interface DateItinerary {
  id: string;
  title: string;
  date: string;
  totalDuration: string;
  totalCost: string;
  activities: ItineraryActivity[];
  matchScore: number;
  matchReason: string;
  createdAt: string;
}

export interface OccasionOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface VibeOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface BudgetOption {
  id: string;
  label: string;
  range: string;
  icon: string;
}

export interface DurationOption {
  id: string;
  label: string;
  hours: string;
  icon: string;
}
