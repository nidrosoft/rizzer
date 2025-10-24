/**
 * RSVP Storage Utility
 * Manages event RSVP data using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RSVP, RSVPStatus } from '@/types/events';

const RSVP_KEY = '@rizzers_rsvps';

// Get all RSVPs
export const getAllRSVPs = async (): Promise<RSVP[]> => {
  try {
    const data = await AsyncStorage.getItem(RSVP_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting RSVPs:', error);
    return [];
  }
};

// Get RSVP for specific event
export const getRSVP = async (eventId: string): Promise<RSVP | null> => {
  try {
    const rsvps = await getAllRSVPs();
    return rsvps.find(rsvp => rsvp.eventId === eventId) || null;
  } catch (error) {
    console.error('Error getting RSVP:', error);
    return null;
  }
};

// Save or update RSVP
export const saveRSVP = async (
  eventId: string,
  status: RSVPStatus,
  reminderEnabled: boolean = true,
  notes?: string
): Promise<boolean> => {
  try {
    const rsvps = await getAllRSVPs();
    const existingIndex = rsvps.findIndex(rsvp => rsvp.eventId === eventId);
    
    const newRSVP: RSVP = {
      eventId,
      status,
      timestamp: new Date().toISOString(),
      reminderEnabled,
      notes,
    };

    if (existingIndex >= 0) {
      rsvps[existingIndex] = newRSVP;
    } else {
      rsvps.push(newRSVP);
    }

    await AsyncStorage.setItem(RSVP_KEY, JSON.stringify(rsvps));
    return true;
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return false;
  }
};

// Remove RSVP
export const removeRSVP = async (eventId: string): Promise<boolean> => {
  try {
    const rsvps = await getAllRSVPs();
    const filtered = rsvps.filter(rsvp => rsvp.eventId !== eventId);
    await AsyncStorage.setItem(RSVP_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing RSVP:', error);
    return false;
  }
};

// Get RSVPs by status
export const getRSVPsByStatus = async (status: RSVPStatus): Promise<RSVP[]> => {
  try {
    const rsvps = await getAllRSVPs();
    return rsvps.filter(rsvp => rsvp.status === status);
  } catch (error) {
    console.error('Error getting RSVPs by status:', error);
    return [];
  }
};

// Get RSVP count
export const getRSVPCount = async (): Promise<number> => {
  try {
    const rsvps = await getAllRSVPs();
    return rsvps.length;
  } catch (error) {
    console.error('Error getting RSVP count:', error);
    return 0;
  }
};

// Check if user RSVP'd to event
export const hasRSVP = async (eventId: string): Promise<boolean> => {
  try {
    const rsvp = await getRSVP(eventId);
    return rsvp !== null && rsvp.status !== null;
  } catch (error) {
    console.error('Error checking RSVP:', error);
    return false;
  }
};

// Clear all RSVPs
export const clearAllRSVPs = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(RSVP_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing RSVPs:', error);
    return false;
  }
};
