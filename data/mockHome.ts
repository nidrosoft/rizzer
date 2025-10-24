/**
 * Mock data for Home feature
 */

import { MessageText1, Calendar, Heart, Lamp, MagicStar } from 'iconsax-react-native';
import { DateProfile, InterestCategory, ActionCard, RizzItem, UpcomingEvent } from '@/types/home';

export const mockDateProfiles: DateProfile[] = [
  { id: '1', name: 'Emma', age: 24, photo: undefined, profession: 'Teacher' },
  { id: '2', name: 'Sarah', age: 26, photo: undefined, profession: 'Hair Braider' },
  { id: '3', name: 'Jessica', age: 23, photo: undefined, profession: 'Real Estate Agent' },
];

export const mockInterestCategories: InterestCategory[] = [
  { emoji: '🎵', title: 'Music', borderColor: 'rgba(255, 107, 157, 0.2)' },
  { emoji: '🍕', title: 'Food', borderColor: 'rgba(255, 87, 87, 0.2)' },
  { emoji: '🎨', title: 'Art', borderColor: 'rgba(171, 71, 188, 0.2)' },
  { emoji: '📸', title: 'Photography', borderColor: 'rgba(38, 198, 218, 0.2)' },
  { emoji: '🎉', title: 'Parties', borderColor: 'rgba(255, 167, 38, 0.2)' },
  { emoji: '🏕️', title: 'Camping', borderColor: 'rgba(102, 187, 106, 0.2)' },
  { emoji: '✈️', title: 'Travel', borderColor: 'rgba(92, 107, 192, 0.2)' },
  { emoji: '🎮', title: 'Gaming', borderColor: 'rgba(236, 64, 122, 0.2)' },
  { emoji: '📚', title: 'Reading', borderColor: 'rgba(255, 202, 40, 0.2)' },
  { emoji: '🏋️', title: 'Fitness', borderColor: 'rgba(255, 112, 67, 0.2)' },
  { emoji: '🎬', title: 'Movies', borderColor: 'rgba(66, 165, 245, 0.2)' },
  { emoji: '☕', title: 'Coffee', borderColor: 'rgba(141, 110, 99, 0.2)' },
];

export const mockActionCards: ActionCard[] = [
  { 
    icon: MessageText1, 
    title: 'Ask for a Date',
    color: '#FF6B9D',
    bgColor: 'rgba(255, 107, 157, 0.05)',
    borderColor: 'rgba(255, 107, 157, 0.2)',
    iconBg: 'rgba(255, 107, 157, 0.15)',
  },
  { 
    icon: Calendar, 
    title: 'Event Invitation',
    color: '#26C6DA',
    bgColor: 'rgba(38, 198, 218, 0.05)',
    borderColor: 'rgba(38, 198, 218, 0.2)',
    iconBg: 'rgba(38, 198, 218, 0.15)',
  },
  { 
    icon: Heart, 
    title: 'Date Ideas',
    color: '#FF5757',
    bgColor: 'rgba(255, 87, 87, 0.05)',
    borderColor: 'rgba(255, 87, 87, 0.2)',
    iconBg: 'rgba(255, 87, 87, 0.15)',
  },
  { 
    icon: Lamp, 
    title: 'Conversation Tips',
    color: '#FFA726',
    bgColor: 'rgba(255, 167, 38, 0.05)',
    borderColor: 'rgba(255, 167, 38, 0.2)',
    iconBg: 'rgba(255, 167, 38, 0.15)',
  },
  { 
    icon: MagicStar, 
    title: 'First Impression',
    color: '#AB47BC',
    bgColor: 'rgba(171, 71, 188, 0.05)',
    borderColor: 'rgba(171, 71, 188, 0.2)',
    iconBg: 'rgba(171, 71, 188, 0.15)',
  },
];

export const mockMyRizz: RizzItem[] = [
  { id: 1, emoji: '😊', title: 'Friendly Opener', color: '#FFE5B4' },
  { id: 2, emoji: '🔥', title: 'Flirty Line', color: '#FFB6C1' },
  { id: 3, emoji: '😂', title: 'Funny Joke', color: '#B4E5FF' },
];

export const mockUpcomingEvents: UpcomingEvent[] = [
  { id: 1, title: 'Speed Dating Night', date: 'Oct 25', location: 'Downtown Bar', image: '🎉' },
  { id: 2, title: 'Singles Mixer', date: 'Oct 28', location: 'Rooftop Lounge', image: '🍸' },
];

// Helper functions
export const getDateProfiles = (): DateProfile[] => mockDateProfiles;
export const getInterestCategories = (): InterestCategory[] => mockInterestCategories;
export const getActionCards = (): ActionCard[] => mockActionCards;
export const getMyRizz = (): RizzItem[] => mockMyRizz;
export const getUpcomingEvents = (): UpcomingEvent[] => mockUpcomingEvents;
