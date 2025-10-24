/**
 * My Events Page
 * User's RSVP'd events (Upcoming/Past)
 * MAX 200 lines - Micro-modular page
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { Event, RSVP } from '@/types/events';
import { getAllRSVPs } from '@/utils/rsvpStorage';
import { getEventById, MOCK_EVENTS } from '@/data/mockEventsDetailed';
import { addEventToCalendar } from '@/utils/calendarUtils';
import { getDirections } from '@/utils/locationUtils';
import TabSwitch from '@/components/ui/TabSwitch';
import EventsList from '@/components/events/EventsList';
import EventsEmptyState from '@/components/events/EventsEmptyState';
import ShareSheet from '@/components/social/ShareSheet';
import { formatShareMessage, generateShareLink } from '@/utils/enhancedShare';

type TabType = 'upcoming' | 'past';

export default function MyEventsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ event: Event; rsvpStatus: any }>>([]);
  const [pastEvents, setPastEvents] = useState<Array<{ event: Event; rsvpStatus: any }>>([]);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const rsvps = await getAllRSVPs();
    const now = new Date();
    
    const upcoming: Array<{ event: Event; rsvpStatus: any }> = [];
    const past: Array<{ event: Event; rsvpStatus: any }> = [];
    
    rsvps.forEach((rsvp: RSVP) => {
      const event = getEventById(rsvp.eventId);
      if (event && rsvp.status !== 'not_going') {
        const eventDate = new Date(event.date);
        if (eventDate >= now) {
          upcoming.push({ event, rsvpStatus: rsvp.status });
        } else {
          past.push({ event, rsvpStatus: rsvp.status });
        }
      }
    });
    
    setUpcomingEvents(upcoming.sort((a, b) => 
      new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
    ));
    setPastEvents(past.sort((a, b) => 
      new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
    ));
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleTabChange = (tab: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveTab(tab as TabType);
  };

  const handleEventPress = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/events/${id}`);
  };

  const handleAddToCalendar = async (event: Event) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const eventDate = new Date(event.date);
    const [startHour, startMin] = event.startTime.split(':');
    const [endHour, endMin] = event.endTime.split(':');
    
    const startDate = new Date(eventDate);
    startDate.setHours(parseInt(startHour), parseInt(startMin));
    
    const endDate = new Date(eventDate);
    endDate.setHours(parseInt(endHour), parseInt(endMin));
    
    await addEventToCalendar(
      event.title,
      startDate,
      endDate,
      event.location.address,
      event.description
    );
  };

  const handleGetDirections = async (event: Event) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await getDirections(event.location.coordinates, event.location.name);
  };

  const handleShare = (event: Event) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedEvent(event);
    setShowShareSheet(true);
  };

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleExplore = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/tabs/discovery');
  };

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <View style={styles.backCircle}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </View>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Events</Text>
          <Text style={styles.headerSubtitle}>
            {upcomingEvents.length + pastEvents.length} events
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabSwitch
          tabs={[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </View>

      {/* Content */}
      {currentEvents.length > 0 ? (
        <EventsList
          events={currentEvents}
          onEventPress={handleEventPress}
          onCalendar={handleAddToCalendar}
          onDirections={handleGetDirections}
          onShare={handleShare}
        />
      ) : (
        <EventsEmptyState type={activeTab} onExplore={handleExplore} />
      )}

      {/* Share Sheet */}
      {selectedEvent && (
        <ShareSheet
          visible={showShareSheet}
          onClose={() => {
            setShowShareSheet(false);
            setSelectedEvent(null);
          }}
          content={{
            title: selectedEvent.title,
            message: formatShareMessage('event', {
              title: selectedEvent.title,
              date: formatEventDate(selectedEvent.date),
              startTime: selectedEvent.startTime,
              location: selectedEvent.location.name,
            }),
            url: generateShareLink('event', selectedEvent.id),
            image: selectedEvent.image,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});
