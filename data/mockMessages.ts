/**
 * Mock Messages Data
 * For testing Investigation Detail chat view
 */

import { Message, ConversationInsight } from '@/types/gifts';

export const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'sherlock',
    content: 'Hey! I heard you\'re looking for a birthday gift for Sarah. I\'d love to help you find something perfect! 🎁',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    sender: 'recipient',
    content: 'Yes! Her birthday is coming up next week and I have no idea what to get her.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 2 * 60 * 1000), // 1h 58m ago
  },
  {
    id: '3',
    sender: 'sherlock',
    content: 'No worries, I\'ve got you covered! Tell me, what are some of Sarah\'s interests or hobbies?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3 * 60 * 1000), // 1h 57m ago
  },
  {
    id: '4',
    sender: 'recipient',
    content: 'She loves tennis! We actually met at the tennis club. She plays almost every weekend.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 1h 55m ago
  },
  {
    id: '5',
    sender: 'sherlock',
    content: 'That\'s great! Tennis enthusiasts are fun to shop for. Does she have all the gear she needs, or is there something specific she\'s been wanting?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 6 * 60 * 1000), // 1h 54m ago
  },
  {
    id: '6',
    sender: 'recipient',
    content: 'She mentioned wanting a new racket, but I\'m not sure which brands are good. She\'s pretty serious about the sport.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: '7',
    sender: 'user',
    content: 'She also loves reading books about sports psychology',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    isInjected: true,
  },
  {
    id: '8',
    sender: 'sherlock',
    content: 'Perfect! That gives me even more to work with. A premium racket combined with some sports psychology books could make an amazing gift combo. What\'s your budget looking like?',
    timestamp: new Date(Date.now() - 40 * 60 * 1000), // 40 mins ago
  },
  {
    id: '9',
    sender: 'recipient',
    content: 'I\'m thinking around $150-200. I want it to be special since she\'s been such a great friend.',
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 mins ago
  },
  {
    id: '10',
    sender: 'sherlock',
    content: 'That\'s a perfect budget! Let me analyze what I\'ve learned and find some great options for you. Give me a moment... 🔍',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
  },
  {
    id: '11',
    sender: 'sherlock',
    content: 'I\'ve found some excellent options! Check the Summary tab to see my top recommendations based on our conversation. 🎾',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
  },
];

export const mockConversationSummary = `Based on our conversation, I've identified that you're looking for a birthday gift for Sarah, a close friend you met at the tennis club. She's a serious tennis player who plays almost every weekend and has mentioned wanting a new racket. She's also interested in sports psychology books.

Your budget of $150-200 is perfect for getting her something meaningful that combines her passion for tennis with her interest in the mental game. I've curated gift suggestions that match these criteria and will make her birthday special.`;

export const mockInsights: ConversationInsight[] = [
  {
    id: '1',
    text: 'Sarah is a serious tennis player (plays weekly)',
    icon: '🎾',
  },
  {
    id: '2',
    text: 'Interested in sports psychology and mental game',
    icon: '🧠',
  },
  {
    id: '3',
    text: 'Close friendship (met at tennis club)',
    icon: '💙',
  },
  {
    id: '4',
    text: 'Budget: $150-200 for something special',
    icon: '💰',
  },
  {
    id: '5',
    text: 'Needs/wants a new tennis racket',
    icon: '✨',
  },
];

export const getMessagesByInvestigationId = (investigationId: string): Message[] => {
  // In a real app, this would fetch messages for specific investigation
  return mockMessages;
};

export const getConversationSummary = (investigationId: string): string => {
  return mockConversationSummary;
};

export const getConversationInsights = (investigationId: string): ConversationInsight[] => {
  return mockInsights;
};
