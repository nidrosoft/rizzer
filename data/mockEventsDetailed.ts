/**
 * Mock Events Data - Detailed
 * Enhanced event data with full information for event detail pages
 */

import { Event } from '@/types/events';
import { LA_LOCATIONS } from '@/utils/locationUtils';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Summer Jazz Night at Hollywood Bowl',
    description: 'Experience an unforgettable evening of smooth jazz under the stars at the iconic Hollywood Bowl. Featuring Grammy-winning artists and a full orchestra, this outdoor concert promises to be a magical night of music, romance, and LA summer vibes.',
    category: 'concert',
    image: '🎵',
    date: '2024-07-15',
    startTime: '19:00',
    endTime: '22:00',
    location: {
      name: 'Hollywood Bowl',
      address: '2301 N Highland Ave, Los Angeles, CA 90068',
      coordinates: LA_LOCATIONS.hollywood,
    },
    price: {
      min: 45,
      max: 150,
      currency: 'USD',
      isFree: false,
    },
    host: {
      name: 'Hollywood Bowl',
      avatar: '🎭',
      verified: true,
    },
    attendees: {
      going: 1247,
      interested: 892,
    },
    tags: ['Jazz', 'Outdoor', 'Romantic', 'Live Music'],
    rating: 4.8,
    reviewCount: 342,
    website: 'https://www.hollywoodbowl.com',
    ticketLink: 'https://www.hollywoodbowl.com/tickets',
    highlights: [
      'Grammy-winning performers',
      'Stunning outdoor venue',
      'Bring your own picnic',
      'Full bar available',
      'Free parking with ticket',
    ],
  },
  {
    id: '2',
    title: 'Downtown LA Food Festival',
    description: 'Taste your way through LA\'s best cuisine at this massive food festival featuring over 100 vendors, celebrity chef demos, live music, and craft cocktails. From street tacos to gourmet desserts, discover the flavors that make LA a food lover\'s paradise.',
    category: 'food',
    image: '🍔',
    date: '2024-07-20',
    startTime: '12:00',
    endTime: '20:00',
    location: {
      name: 'Grand Park',
      address: '200 N Grand Ave, Los Angeles, CA 90012',
      coordinates: LA_LOCATIONS.downtownLA,
    },
    price: {
      min: 0,
      max: 0,
      currency: 'USD',
      isFree: true,
    },
    host: {
      name: 'LA Food Events',
      avatar: '🍽️',
      verified: true,
    },
    attendees: {
      going: 3421,
      interested: 1567,
    },
    tags: ['Food', 'Festival', 'Family Friendly', 'Outdoor'],
    rating: 4.6,
    reviewCount: 567,
    website: 'https://www.lafoodfest.com',
    highlights: [
      'Free admission',
      '100+ food vendors',
      'Celebrity chef demos',
      'Live music all day',
      'Craft beer garden',
    ],
  },
  {
    id: '3',
    title: 'Santa Monica Sunset Yoga',
    description: 'Join us for a peaceful yoga session on the beach as the sun sets over the Pacific Ocean. All levels welcome! Bring your mat and water, and prepare for a rejuvenating experience with ocean views and the sound of waves.',
    category: 'outdoor',
    image: '🧘',
    date: '2024-07-18',
    startTime: '18:30',
    endTime: '20:00',
    location: {
      name: 'Santa Monica Beach',
      address: 'Santa Monica State Beach, Santa Monica, CA 90401',
      coordinates: LA_LOCATIONS.santaMonica,
    },
    price: {
      min: 15,
      max: 15,
      currency: 'USD',
      isFree: false,
    },
    host: {
      name: 'Beach Yoga LA',
      avatar: '🌊',
      verified: true,
    },
    attendees: {
      going: 87,
      interested: 143,
    },
    tags: ['Yoga', 'Beach', 'Sunset', 'Wellness', 'Outdoor'],
    rating: 4.9,
    reviewCount: 234,
    website: 'https://www.beachyogala.com',
    highlights: [
      'Beachfront location',
      'All levels welcome',
      'Mats provided',
      'Sunset views',
      'Post-yoga social',
    ],
  },
  {
    id: '4',
    title: 'Beverly Hills Art Walk',
    description: 'Explore the finest art galleries in Beverly Hills during this exclusive monthly art walk. Meet artists, view new exhibitions, enjoy wine and hors d\'oeuvres, and discover unique pieces from emerging and established artists.',
    category: 'art',
    image: '🎨',
    date: '2024-07-22',
    startTime: '18:00',
    endTime: '21:00',
    location: {
      name: 'Beverly Hills Gallery District',
      address: 'Rodeo Drive, Beverly Hills, CA 90210',
      coordinates: LA_LOCATIONS.beverlyHills,
    },
    price: {
      min: 0,
      max: 0,
      currency: 'USD',
      isFree: true,
    },
    host: {
      name: 'Beverly Hills Arts Council',
      avatar: '🖼️',
      verified: true,
    },
    attendees: {
      going: 234,
      interested: 456,
    },
    tags: ['Art', 'Culture', 'Free', 'Wine', 'Networking'],
    rating: 4.7,
    reviewCount: 189,
    website: 'https://www.beverlyhillsarts.com',
    highlights: [
      'Free admission',
      '15+ galleries',
      'Meet the artists',
      'Wine & appetizers',
      'Exclusive previews',
    ],
  },
  {
    id: '5',
    title: 'Griffith Observatory Star Party',
    description: 'Look through powerful telescopes and explore the night sky with expert astronomers. This free monthly event offers a unique opportunity to see planets, stars, and galaxies up close while learning about the cosmos.',
    category: 'culture',
    image: '🔭',
    date: '2024-07-25',
    startTime: '20:00',
    endTime: '23:00',
    location: {
      name: 'Griffith Observatory',
      address: '2800 E Observatory Rd, Los Angeles, CA 90027',
      coordinates: LA_LOCATIONS.griffithPark,
    },
    price: {
      min: 0,
      max: 0,
      currency: 'USD',
      isFree: true,
    },
    host: {
      name: 'Griffith Observatory',
      avatar: '🌟',
      verified: true,
    },
    attendees: {
      going: 567,
      interested: 789,
    },
    tags: ['Astronomy', 'Educational', 'Free', 'Night', 'Romantic'],
    rating: 4.9,
    reviewCount: 423,
    website: 'https://www.griffithobservatory.org',
    highlights: [
      'Free admission',
      'Professional telescopes',
      'Expert astronomers',
      'City views',
      'Educational talks',
    ],
  },
];

// Helper functions
export const getEventById = (id: string): Event | undefined => {
  return MOCK_EVENTS.find(event => event.id === id);
};

export const getEventsByCategory = (category: string): Event[] => {
  return MOCK_EVENTS.filter(event => event.category === category);
};

export const getUpcomingEvents = (): Event[] => {
  const now = new Date();
  return MOCK_EVENTS.filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getPastEvents = (): Event[] => {
  const now = new Date();
  return MOCK_EVENTS.filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFreeEvents = (): Event[] => {
  return MOCK_EVENTS.filter(event => event.price.isFree);
};
