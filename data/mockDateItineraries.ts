/**
 * Mock AI-Generated Date Itineraries
 */

import { DateItinerary, ItineraryActivity } from '@/types/datePlanner';

export const mockItineraries: DateItinerary[] = [
  {
    id: '1',
    title: 'Romantic Evening in Downtown LA',
    date: new Date().toISOString(),
    totalDuration: '4 hours',
    totalCost: '$120-150',
    matchScore: 95,
    matchReason: 'Perfect blend of romance, great food, and stunning views based on your preferences',
    createdAt: new Date().toISOString(),
    activities: [
      {
        id: 'a1',
        time: '6:00 PM',
        duration: '1.5 hours',
        title: 'Dinner at Perch',
        description: 'French-inspired rooftop restaurant with breathtaking city views and romantic ambiance',
        category: 'food',
        location: 'Perch LA',
        address: '448 S Hill St, Los Angeles, CA 90013',
        estimatedCost: '$60-80',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
        tips: [
          'Make a reservation for a window seat',
          'Try their signature French 75 cocktail',
          'Arrive 15 minutes early to enjoy the rooftop bar',
        ],
        reservationRequired: true,
      },
      {
        id: 'a2',
        time: '7:45 PM',
        duration: '45 minutes',
        title: 'Stroll Through Grand Park',
        description: 'Romantic walk through beautifully lit park with fountains and city views',
        category: 'activity',
        location: 'Grand Park',
        address: '200 N Grand Ave, Los Angeles, CA 90012',
        estimatedCost: 'Free',
        image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&h=400&fit=crop',
        tips: [
          'Perfect for photos with the fountain',
          'Usually less crowded on weeknights',
          'Bring a light jacket for the evening breeze',
        ],
        reservationRequired: false,
      },
      {
        id: 'a3',
        time: '8:45 PM',
        duration: '1.5 hours',
        title: 'Live Jazz at The Blue Whale',
        description: 'Intimate jazz club featuring talented local musicians in a cozy setting',
        category: 'entertainment',
        location: 'The Blue Whale',
        address: '123 Astronaut E S Onizuka St, Los Angeles, CA 90012',
        estimatedCost: '$30-40',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=400&fit=crop',
        tips: [
          'Shows start at 9 PM sharp',
          'Cash only for cover charge',
          'Arrive early for best seating',
        ],
        reservationRequired: false,
      },
      {
        id: 'a4',
        time: '10:30 PM',
        duration: '30 minutes',
        title: 'Dessert at Salt & Straw',
        description: 'Artisan ice cream with unique flavors to end the night on a sweet note',
        category: 'food',
        location: 'Salt & Straw',
        address: '240 S Broadway, Los Angeles, CA 90012',
        estimatedCost: '$10-15',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
        tips: [
          'Try their seasonal flavors',
          'Order a flight to taste multiple flavors',
          'Open until 11 PM on weekends',
        ],
        reservationRequired: false,
      },
    ],
  },
];

export const getItineraryById = (id: string): DateItinerary | undefined => {
  return mockItineraries.find(itinerary => itinerary.id === id);
};

export const getMockItinerary = (): DateItinerary => {
  return mockItineraries[0];
};
