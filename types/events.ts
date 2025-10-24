/**
 * Event Types
 * Type definitions for events, RSVP, and reminders
 */

export type EventCategory = 'concert' | 'festival' | 'sports' | 'food' | 'art' | 'nightlife' | 'outdoor' | 'culture';
export type RSVPStatus = 'going' | 'interested' | 'not_going' | null;

export interface EventLocation {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EventPrice {
  min: number;
  max: number;
  currency: string;
  isFree: boolean;
}

export interface EventHost {
  name: string;
  avatar: string;
  verified: boolean;
}

export interface EventAttendees {
  going: number;
  interested: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  location: EventLocation;
  price: EventPrice;
  host: EventHost;
  attendees: EventAttendees;
  tags: string[];
  rating: number;
  reviewCount: number;
  website?: string;
  ticketLink?: string;
  highlights: string[];
}

export interface RSVP {
  eventId: string;
  status: RSVPStatus;
  timestamp: string;
  reminderEnabled: boolean;
  notes?: string;
}

export interface EventReminder {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  reminderTimes: number[]; // Minutes before event
  enabled: boolean;
}

export interface EventFilter {
  category?: EventCategory;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  status?: RSVPStatus;
}
