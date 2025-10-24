/**
 * AI Date Planner Constants
 */

import { OccasionOption, VibeOption, BudgetOption, DurationOption } from '@/types/datePlanner';

export const OCCASIONS: OccasionOption[] = [
  {
    id: 'first_date',
    label: 'First Date',
    icon: '💫',
    description: 'Make a great first impression',
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    icon: '💝',
    description: 'Celebrate your special day',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    icon: '🎂',
    description: 'Make their day unforgettable',
  },
  {
    id: 'casual',
    label: 'Casual Hangout',
    icon: '😊',
    description: 'Relaxed and fun',
  },
  {
    id: 'romantic',
    label: 'Romantic Evening',
    icon: '🌹',
    description: 'Create magical moments',
  },
  {
    id: 'surprise',
    label: 'Surprise Date',
    icon: '🎁',
    description: 'Plan something unexpected',
  },
];

export const VIBES: VibeOption[] = [
  {
    id: 'adventurous',
    label: 'Adventurous',
    icon: '🏔️',
    description: 'Exciting and active',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    icon: '💕',
    description: 'Intimate and special',
  },
  {
    id: 'fun',
    label: 'Fun & Playful',
    icon: '🎉',
    description: 'Lighthearted and entertaining',
  },
  {
    id: 'cultural',
    label: 'Cultural',
    icon: '🎭',
    description: 'Arts and experiences',
  },
  {
    id: 'relaxed',
    label: 'Relaxed',
    icon: '☕',
    description: 'Chill and comfortable',
  },
  {
    id: 'foodie',
    label: 'Foodie',
    icon: '🍽️',
    description: 'Culinary experiences',
  },
];

export const BUDGETS: BudgetOption[] = [
  {
    id: 'budget',
    label: 'Budget Friendly',
    range: 'Under $50',
    icon: '💰',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    range: '$50 - $150',
    icon: '💵',
  },
  {
    id: 'premium',
    label: 'Premium',
    range: '$150 - $300',
    icon: '💎',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    range: '$300+',
    icon: '✨',
  },
];

export const DURATIONS: DurationOption[] = [
  {
    id: 'quick',
    label: 'Quick Date',
    hours: '2-3 hours',
    icon: '⏱️',
  },
  {
    id: 'half_day',
    label: 'Half Day',
    hours: '4-6 hours',
    icon: '🌤️',
  },
  {
    id: 'full_day',
    label: 'Full Day',
    hours: '8+ hours',
    icon: '☀️',
  },
  {
    id: 'evening',
    label: 'Evening Only',
    hours: '3-4 hours',
    icon: '🌙',
  },
];
