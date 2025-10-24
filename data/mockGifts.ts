/**
 * Mock data for Gifts feature
 * Separated from UI logic for better maintainability
 */

import { Investigation } from '@/types/gifts';

export const mockInvestigations: Investigation[] = [
  // Active investigations
  {
    id: '1',
    recipientName: 'Sarah Johnson',
    recipientAvatar: undefined,
    occasion: 'Birthday',
    context: 'Friend from Tennis Club',
    status: 'in_progress',
    messageCount: 12,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '2',
    recipientName: 'Mike Chen',
    recipientAvatar: undefined,
    occasion: 'Secret Santa',
    context: 'Coworker',
    status: 'waiting',
    messageCount: 5,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: '3',
    recipientName: 'Emma Davis',
    recipientAvatar: undefined,
    occasion: 'Anniversary',
    context: 'Best Friend',
    status: 'in_progress',
    messageCount: 8,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  
  // Completed investigations
  {
    id: '4',
    recipientName: 'Alex Thompson',
    recipientAvatar: undefined,
    occasion: 'Just Because',
    context: 'Roommate',
    status: 'completed',
    messageCount: 15,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: '5',
    recipientName: 'Jessica Lee',
    recipientAvatar: undefined,
    occasion: 'Birthday',
    context: 'Sister',
    status: 'completed',
    messageCount: 20,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
  },
  {
    id: '6',
    recipientName: 'David Park',
    recipientAvatar: undefined,
    occasion: 'Graduation',
    context: 'Cousin',
    status: 'completed',
    messageCount: 18,
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16), // 16 days ago
  },
];

/**
 * Helper function to filter investigations by status
 */
export const getActiveInvestigations = (investigations: Investigation[]): Investigation[] => {
  return investigations.filter(inv => 
    inv.status === 'in_progress' || 
    inv.status === 'waiting' || 
    inv.status === 'paused'
  );
};

export const getCompletedInvestigations = (investigations: Investigation[]): Investigation[] => {
  return investigations.filter(inv => 
    inv.status === 'completed' || 
    inv.status === 'declined'
  );
};
