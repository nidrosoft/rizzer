/**
 * Mock Gift Suggestions Data
 * For testing and development of Step 3
 */

import { GiftSuggestion } from '@/types/gifts';

export const mockGiftSuggestions: GiftSuggestion[] = [
  {
    id: '1',
    title: 'Premium Tennis Racket Set',
    description: 'Professional-grade racket with accessories perfect for tennis enthusiasts',
    price: '$129.99',
    category: 'Sports & Outdoors',
    reasoning: 'Based on your friend\'s passion for tennis and their active lifestyle, this high-quality racket would be both practical and thoughtful.',
    matchScore: 95,
    imageUrl: 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=Tennis+Racket',
    purchaseUrl: 'https://www.amazon.com/s?k=tennis+racket',
  },
  {
    id: '2',
    title: 'Personalized Tennis Bag',
    description: 'Custom embroidered tennis bag with multiple compartments',
    price: '$79.99',
    category: 'Sports Accessories',
    reasoning: 'A personalized touch shows extra thought, and the practical design will be useful for their tennis club activities.',
    matchScore: 88,
    imageUrl: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Tennis+Bag',
    purchaseUrl: 'https://www.amazon.com/s?k=tennis+bag',
  },
  {
    id: '3',
    title: 'Smart Fitness Tracker',
    description: 'Advanced fitness watch with tennis mode and performance tracking',
    price: '$199.99',
    category: 'Technology',
    reasoning: 'Perfect for tracking tennis performance and overall fitness goals, combining their sport interest with tech.',
    matchScore: 92,
    imageUrl: 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=Fitness+Watch',
    purchaseUrl: 'https://www.amazon.com/s?k=fitness+tracker',
  },
  {
    id: '4',
    title: 'Tennis Club Membership Gift Card',
    description: '3-month premium membership at local tennis club',
    price: '$299.99',
    category: 'Experiences',
    reasoning: 'An experience gift that supports their hobby and provides lasting value beyond a physical item.',
    matchScore: 85,
    imageUrl: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Club+Pass',
    purchaseUrl: 'https://www.giftcards.com',
  },
  {
    id: '5',
    title: 'Tennis Training Book Collection',
    description: 'Set of 3 books on tennis techniques and mental game',
    price: '$49.99',
    category: 'Books & Education',
    reasoning: 'For someone passionate about tennis, these books offer ways to improve their game and deepen their knowledge.',
    matchScore: 78,
    imageUrl: 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=Tennis+Books',
    purchaseUrl: 'https://www.amazon.com/s?k=tennis+books',
  },
];

export const getGiftSuggestions = (): GiftSuggestion[] => {
  return mockGiftSuggestions;
};

export const getTopSuggestion = (): GiftSuggestion => {
  return mockGiftSuggestions[0];
};

export const getSuggestionById = (id: string): GiftSuggestion | undefined => {
  return mockGiftSuggestions.find(s => s.id === id);
};
