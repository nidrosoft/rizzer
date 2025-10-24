/**
 * Events Section Component
 * Upcoming events happening near you
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import EventCard from './EventCard';
import { Event } from '@/types/discovery';

interface EventsSectionProps {
  events: Event[];
  onEventPress: (id: string) => void;
  onInterested: (id: string) => void;
  onShare: (id: string) => void;
  onSeeAll: () => void;
}

export default function EventsSection({ events, onEventPress, onInterested, onShare, onSeeAll }: EventsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🎉 Happening Near You</Text>
          <Text style={styles.subtitle}>Events perfect for dates</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
          <ArrowRight2 size={16} color={Colors.purple} variant="Outline" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.list}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={onEventPress}
            onInterested={onInterested}
            onShare={onShare}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
});
