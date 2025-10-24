/**
 * Events List Component
 * Scrollable list of event cards
 * MAX 80 lines - Micro component
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { Event, RSVPStatus } from '@/types/events';
import MyEventCard from './MyEventCard';

interface EventsListProps {
  events: Array<{ event: Event; rsvpStatus: RSVPStatus }>;
  onEventPress: (id: string) => void;
  onCalendar: (event: Event) => void;
  onDirections: (event: Event) => void;
  onShare: (event: Event) => void;
}

export default function EventsList({
  events,
  onEventPress,
  onCalendar,
  onDirections,
  onShare,
}: EventsListProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {events.map(({ event, rsvpStatus }) => (
        <MyEventCard
          key={event.id}
          event={event}
          rsvpStatus={rsvpStatus}
          onPress={() => onEventPress(event.id)}
          onCalendar={() => onCalendar(event)}
          onDirections={() => onDirections(event)}
          onShare={() => onShare(event)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
