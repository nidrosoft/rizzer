/**
 * Constants and configuration for Gifts feature
 * Centralized configuration for easy updates
 */

import { Colors } from './theme';
import { Occasion } from '@/types/gifts';

export const GiftsConfig = {
  // Tab labels
  tabs: {
    active: 'Active',
    completed: 'Completed',
  },
  
  // Empty state messages
  emptyStates: {
    active: {
      title: 'No Active Investigations',
      description: 'Start a new investigation to discover the perfect gift for someone special.',
      actionLabel: 'Start Investigation',
    },
    completed: {
      title: 'No Completed Investigations',
      description: 'Your completed investigations will appear here.',
      actionLabel: undefined,
    },
  },
  
  // Status configurations
  statusConfig: {
    in_progress: {
      label: 'In Progress',
      color: Colors.purple,
      backgroundColor: `${Colors.purple}15`,
    },
    waiting: {
      label: 'Waiting',
      color: Colors.warning,
      backgroundColor: `${Colors.warning}15`,
    },
    completed: {
      label: 'Completed',
      color: Colors.success,
      backgroundColor: `${Colors.success}15`,
    },
    paused: {
      label: 'Paused',
      color: Colors.textSecondary,
      backgroundColor: `${Colors.textSecondary}15`,
    },
    declined: {
      label: 'Declined',
      color: Colors.error,
      backgroundColor: `${Colors.error}15`,
    },
  },
  
  // Gradient colors for Gifts feature
  gradient: {
    start: '#EC4899', // Pink
    end: '#8B5CF6',   // Purple
  },
  
  // Occasions configuration
  occasions: [
    {
      id: 'birthday',
      label: 'Birthday',
      icon: '🎂',
      description: 'Celebrate their special day',
    },
    {
      id: 'secret_santa',
      label: 'Secret Santa',
      icon: '🎅',
      description: 'Holiday gift exchange',
    },
    {
      id: 'anniversary',
      label: 'Anniversary',
      icon: '💝',
      description: 'Celebrate a milestone',
    },
    {
      id: 'graduation',
      label: 'Graduation',
      icon: '🎓',
      description: 'Honor their achievement',
    },
    {
      id: 'just_because',
      label: 'Just Because',
      icon: '✨',
      description: 'Show you care anytime',
    },
  ] as Occasion[],
  
  // Form placeholders
  placeholders: {
    relationshipContext: 'e.g., Friend from Tennis Club, Coworker, Sister...',
    search: 'Search contacts...',
  },
  
  // Contact source labels
  contactSources: {
    phone: 'Phone Contacts',
    app: 'App Users',
  },
};
