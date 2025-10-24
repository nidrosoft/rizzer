/**
 * Event Reminders Utility
 * Manages event reminders and calendar integration
 * MAX 150 lines - Micro utility
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventReminder } from '@/types/events';
import { addEventToCalendar } from '@/utils/calendarUtils';

const REMINDERS_KEY = '@rizzers_event_reminders';

// Default reminder times (in minutes before event)
export const DEFAULT_REMINDER_TIMES = [30, 120, 1440]; // 30 min, 2 hours, 1 day

// Get all reminders
export const getAllReminders = async (): Promise<EventReminder[]> => {
  try {
    const data = await AsyncStorage.getItem(REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

// Get reminder for specific event
export const getReminder = async (eventId: string): Promise<EventReminder | null> => {
  try {
    const reminders = await getAllReminders();
    return reminders.find(r => r.eventId === eventId) || null;
  } catch (error) {
    console.error('Error getting reminder:', error);
    return null;
  }
};

// Create reminder for event
export const createReminder = async (
  eventId: string,
  eventTitle: string,
  eventDate: string,
  reminderTimes: number[] = DEFAULT_REMINDER_TIMES
): Promise<boolean> => {
  try {
    const reminders = await getAllReminders();
    const existingIndex = reminders.findIndex(r => r.eventId === eventId);
    
    const newReminder: EventReminder = {
      eventId,
      eventTitle,
      eventDate,
      reminderTimes,
      enabled: true,
    };

    if (existingIndex >= 0) {
      reminders[existingIndex] = newReminder;
    } else {
      reminders.push(newReminder);
    }

    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    return true;
  } catch (error) {
    console.error('Error creating reminder:', error);
    return false;
  }
};

// Update reminder times
export const updateReminderTimes = async (
  eventId: string,
  reminderTimes: number[]
): Promise<boolean> => {
  try {
    const reminders = await getAllReminders();
    const index = reminders.findIndex(r => r.eventId === eventId);
    
    if (index >= 0) {
      reminders[index].reminderTimes = reminderTimes;
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating reminder times:', error);
    return false;
  }
};

// Toggle reminder enabled/disabled
export const toggleReminder = async (eventId: string): Promise<boolean> => {
  try {
    const reminders = await getAllReminders();
    const index = reminders.findIndex(r => r.eventId === eventId);
    
    if (index >= 0) {
      reminders[index].enabled = !reminders[index].enabled;
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
      return reminders[index].enabled;
    }
    return false;
  } catch (error) {
    console.error('Error toggling reminder:', error);
    return false;
  }
};

// Remove reminder
export const removeReminder = async (eventId: string): Promise<boolean> => {
  try {
    const reminders = await getAllReminders();
    const filtered = reminders.filter(r => r.eventId !== eventId);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing reminder:', error);
    return false;
  }
};

// Get upcoming reminders (next 7 days)
export const getUpcomingReminders = async (): Promise<EventReminder[]> => {
  try {
    const reminders = await getAllReminders();
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return reminders
      .filter(r => {
        const eventDate = new Date(r.eventDate);
        return r.enabled && eventDate >= now && eventDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  } catch (error) {
    console.error('Error getting upcoming reminders:', error);
    return [];
  }
};

// Format reminder time for display
export const formatReminderTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} minutes before`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours before`;
  return `${Math.floor(minutes / 1440)} days before`;
};
