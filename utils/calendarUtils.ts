/**
 * Calendar Utilities
 * Functions for adding events to device calendar and managing reminders
 */

import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

// Request calendar permissions
export const requestCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Calendar access is needed to add events to your calendar.',
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
};

// Get default calendar
export const getDefaultCalendar = async (): Promise<string | null> => {
  try {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    
    // Find default calendar
    const defaultCalendar = calendars.find(
      cal => cal.allowsModifications && cal.isPrimary
    ) || calendars.find(cal => cal.allowsModifications);
    
    return defaultCalendar?.id || null;
  } catch (error) {
    console.error('Error getting default calendar:', error);
    return null;
  }
};

// Add date event to calendar
export const addDateToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  notes?: string
): Promise<boolean> => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) return false;

    const calendarId = await getDefaultCalendar();
    if (!calendarId) {
      Alert.alert('Error', 'No calendar available to add events.');
      return false;
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      startDate,
      endDate,
      location: location || '',
      notes: notes || '',
      timeZone: 'America/Los_Angeles', // Use device timezone
      alarms: [
        { relativeOffset: -60 }, // 1 hour before
        { relativeOffset: -1440 }, // 1 day before
      ],
    });

    if (eventId) {
      Alert.alert(
        'Success!',
        'Date added to your calendar with reminders.',
        [{ text: 'OK' }]
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    Alert.alert('Error', 'Failed to add event to calendar.');
    return false;
  }
};

// Add event to calendar
export const addEventToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  description?: string
): Promise<boolean> => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) return false;

    const calendarId = await getDefaultCalendar();
    if (!calendarId) {
      Alert.alert('Error', 'No calendar available to add events.');
      return false;
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      startDate,
      endDate,
      location: location || '',
      notes: description || '',
      timeZone: 'America/Los_Angeles',
      alarms: [
        { relativeOffset: -30 }, // 30 minutes before
        { relativeOffset: -120 }, // 2 hours before
      ],
    });

    if (eventId) {
      Alert.alert(
        'Added to Calendar',
        'Event added with reminders.',
        [{ text: 'OK' }]
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    Alert.alert('Error', 'Failed to add event to calendar.');
    return false;
  }
};

// Create reminder for date
export const createDateReminder = async (
  title: string,
  date: Date,
  reminderMinutes: number = 60
): Promise<boolean> => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) return false;

    const calendarId = await getDefaultCalendar();
    if (!calendarId) return false;

    const reminderDate = new Date(date.getTime() - reminderMinutes * 60000);
    
    const eventId = await Calendar.createEventAsync(calendarId, {
      title: `Reminder: ${title}`,
      startDate: reminderDate,
      endDate: new Date(reminderDate.getTime() + 15 * 60000), // 15 min duration
      timeZone: 'America/Los_Angeles',
      alarms: [{ relativeOffset: 0 }],
    });

    return !!eventId;
  } catch (error) {
    console.error('Error creating reminder:', error);
    return false;
  }
};

// Format date for calendar display
export const formatCalendarDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
};

// Check if date is in the past
export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

// Get upcoming dates from calendar
export const getUpcomingDates = async (daysAhead: number = 30): Promise<any[]> => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) return [];

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const calendarIds = calendars.map(cal => cal.id);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    const events = await Calendar.getEventsAsync(calendarIds, startDate, endDate);
    
    return events.filter(event => 
      event.title.toLowerCase().includes('date') ||
      event.title.toLowerCase().includes('dinner') ||
      event.title.toLowerCase().includes('movie')
    );
  } catch (error) {
    console.error('Error getting upcoming dates:', error);
    return [];
  }
};
