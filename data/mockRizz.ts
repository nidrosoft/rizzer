/**
 * Mock data for Rizz feature
 */

import { MessageText, Heart, Lamp, MagicStar, Cup, Book, Music, Camera } from 'iconsax-react-native';
import { RizzCategory, ChatThread } from '@/types/rizz';

export const mockRizzCategories: RizzCategory[] = [
  {
    id: 1,
    title: 'Conversation Starters',
    icon: MessageText,
    color: '#FF6B9D',
    bgColor: 'rgba(255, 107, 157, 0.05)',
    borderColor: 'rgba(255, 107, 157, 0.2)',
    iconBg: 'rgba(255, 107, 157, 0.15)',
  },
  {
    id: 2,
    title: 'Compliments',
    icon: Heart,
    color: '#FF5757',
    bgColor: 'rgba(255, 87, 87, 0.05)',
    borderColor: 'rgba(255, 87, 87, 0.2)',
    iconBg: 'rgba(255, 87, 87, 0.15)',
  },
  {
    id: 3,
    title: 'Icebreakers',
    icon: Lamp,
    color: '#FFA726',
    bgColor: 'rgba(255, 167, 38, 0.05)',
    borderColor: 'rgba(255, 167, 38, 0.2)',
    iconBg: 'rgba(255, 167, 38, 0.15)',
  },
  {
    id: 4,
    title: 'Flirty Lines',
    icon: MagicStar,
    color: '#AB47BC',
    bgColor: 'rgba(171, 71, 188, 0.05)',
    borderColor: 'rgba(171, 71, 188, 0.2)',
    iconBg: 'rgba(171, 71, 188, 0.15)',
  },
  {
    id: 5,
    title: 'Date Ideas',
    icon: Cup,
    color: '#26C6DA',
    bgColor: 'rgba(38, 198, 218, 0.05)',
    borderColor: 'rgba(38, 198, 218, 0.2)',
    iconBg: 'rgba(38, 198, 218, 0.15)',
  },
  {
    id: 6,
    title: 'Deep Questions',
    icon: Book,
    color: '#66BB6A',
    bgColor: 'rgba(102, 187, 106, 0.05)',
    borderColor: 'rgba(102, 187, 106, 0.2)',
    iconBg: 'rgba(102, 187, 106, 0.15)',
  },
  {
    id: 7,
    title: 'Fun Activities',
    icon: Music,
    color: '#5C6BC0',
    bgColor: 'rgba(92, 107, 192, 0.05)',
    borderColor: 'rgba(92, 107, 192, 0.2)',
    iconBg: 'rgba(92, 107, 192, 0.15)',
  },
  {
    id: 8,
    title: 'Photo Prompts',
    icon: Camera,
    color: '#EC407A',
    bgColor: 'rgba(236, 64, 122, 0.05)',
    borderColor: 'rgba(236, 64, 122, 0.2)',
    iconBg: 'rgba(236, 64, 122, 0.15)',
  },
  {
    id: 9,
    title: 'Funny Openers',
    icon: MessageText,
    color: '#FFCA28',
    bgColor: 'rgba(255, 202, 40, 0.05)',
    borderColor: 'rgba(255, 202, 40, 0.2)',
    iconBg: 'rgba(255, 202, 40, 0.15)',
  },
];

export const mockChatThreads: ChatThread[] = [
  // Today (3 chats)
  {
    id: '1',
    title: 'Dating advice for first date',
    lastMessage: 'Thanks for the advice!',
    timestamp: new Date(),
  },
  {
    id: '2',
    title: 'Best conversation starters',
    lastMessage: 'These are perfect!',
    timestamp: new Date(),
  },
  {
    id: '3',
    title: 'How to be more confident',
    lastMessage: 'Really appreciate this',
    timestamp: new Date(),
  },
  // 3 days ago (4 chats)
  {
    id: '4',
    title: 'How to start a conversation',
    lastMessage: 'That really helped!',
    timestamp: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '5',
    title: 'Flirty text message ideas',
    lastMessage: 'Love these suggestions',
    timestamp: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '6',
    title: 'Date night activity ideas',
    lastMessage: "Can't wait to try these",
    timestamp: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '7',
    title: 'How to keep conversation flowing',
    lastMessage: 'This is so helpful',
    timestamp: new Date(Date.now() - 86400000 * 3),
  },
  // 1 month ago (5 chats)
  {
    id: '8',
    title: 'Compliment ideas',
    lastMessage: 'Great suggestions',
    timestamp: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: '9',
    title: 'How to ask someone out',
    lastMessage: 'Feeling more confident now',
    timestamp: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: '10',
    title: 'Dealing with rejection',
    lastMessage: 'Thank you for this',
    timestamp: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: '11',
    title: 'Building emotional connection',
    lastMessage: 'This makes so much sense',
    timestamp: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: '12',
    title: 'Long distance relationship tips',
    lastMessage: 'Exactly what I needed',
    timestamp: new Date(Date.now() - 86400000 * 30),
  },
];

// Helper functions
export const getRizzCategories = (): RizzCategory[] => mockRizzCategories;
export const getChatThreads = (): ChatThread[] => mockChatThreads;

export const getRelativeTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Recently';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Recently';
  }
};

export const groupChatsByDate = (chats: any[]) => {
  const groups: { [key: string]: any[] } = {};

  chats.forEach((chat) => {
    try {
      // Use last_message_at or created_at as fallback, or current date
      const dateToUse = chat.last_message_at || chat.created_at || chat.timestamp || new Date().toISOString();
      const timeLabel = getRelativeTime(dateToUse);
      if (!groups[timeLabel]) {
        groups[timeLabel] = [];
      }
      
      // Transform to match expected format
      const transformedChat = {
        id: chat.id,
        title: chat.title || 'New Conversation',
        lastMessage: chat.last_message || 'Start a conversation...',
        timestamp: chat.last_message_at || chat.created_at || new Date().toISOString(),
      };
      
      groups[timeLabel].push(transformedChat);
    } catch (error) {
      console.error('Error grouping chat:', error, chat);
      // Skip this chat if there's an error
    }
  });

  return Object.entries(groups).map(([timeLabel, chats]) => ({
    timeLabel,
    chats,
  }));
};
