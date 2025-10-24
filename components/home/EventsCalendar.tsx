/**
 * EventsCalendar Component
 * Displays upcoming events from Discovery
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Calendar, Location, ArrowRight2, Heart, Cup, MusicSquare, Cake } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { UpcomingEventsSectionProps } from '@/types/home';

// Event type to icon/color mapping
const getEventStyle = (title: string) => {
  if (title.toLowerCase().includes('speed dating')) {
    return { 
      IconComponent: Heart, 
      color: '#FF6B9D', 
      bg: 'rgba(255, 107, 157, 0.15)' 
    };
  } else if (title.toLowerCase().includes('mixer') || title.toLowerCase().includes('singles')) {
    return { 
      IconComponent: Cup, 
      color: '#AB47BC', 
      bg: 'rgba(171, 71, 188, 0.15)' 
    };
  } else if (title.toLowerCase().includes('party')) {
    return { 
      IconComponent: MusicSquare, 
      color: '#FFA726', 
      bg: 'rgba(255, 167, 38, 0.15)' 
    };
  } else if (title.toLowerCase().includes('dinner')) {
    return { 
      IconComponent: Cake, 
      color: '#FF5757', 
      bg: 'rgba(255, 87, 87, 0.15)' 
    };
  }
  return { 
    IconComponent: Calendar, 
    color: '#26C6DA', 
    bg: 'rgba(38, 198, 218, 0.15)' 
  };
};

export default function EventsCalendar({
  events,
  onEventPress,
  onViewAll,
}: UpcomingEventsSectionProps) {
  const handleEventPress = (event: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onEventPress?.(event);
  };

  const handleViewAll = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onViewAll?.();
  };

  // Only show first 2 events
  const displayEvents = events.slice(0, 2);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {displayEvents.map((event) => {
        const eventStyle = getEventStyle(event.title);
        const EventIcon = eventStyle.IconComponent;
        return (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => handleEventPress(event)}
            activeOpacity={0.7}
          >
            <View style={[styles.eventIcon, { backgroundColor: eventStyle.bg }]}>
              <EventIcon size={24} color={eventStyle.color} variant="Bold" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventMeta}>
                <View style={styles.metaItem}>
                  <Calendar size={16} color={eventStyle.color} variant="Bold" />
                  <Text style={[styles.metaText, { color: eventStyle.color }]}>{event.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Location size={16} color={Colors.textSecondary} variant="Bold" />
                  <Text style={styles.metaText}>{event.location}</Text>
                </View>
              </View>
            </View>
            <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  viewAll: {
    fontSize: FontSizes.sm,
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
