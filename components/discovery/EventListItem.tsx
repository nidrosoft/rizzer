/**
 * Event List Item Component
 * Compact event card for list views
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Calendar, Location, People, Heart } from 'iconsax-react-native';
import { Event } from '@/types/discovery';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface EventListItemProps {
  event: Event;
  onPress: (id: string) => void;
  onInterested: (id: string) => void;
}

export default function EventListItem({ event, onPress, onInterested }: EventListItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
    >
      {/* Image */}
      <Image
        source={{ uri: event.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Title & Category */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Calendar size={14} color={Colors.textSecondary} variant="Bold" />
          <Text style={styles.infoText}>
            {event.date} • {event.time}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <Location size={14} color={Colors.textSecondary} variant="Bold" />
          <Text style={styles.infoText} numberOfLines={1}>
            {event.location}
          </Text>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.price}>{event.price}</Text>
            <View style={styles.attendees}>
              <People size={12} color={Colors.textSecondary} variant="Bold" />
              <Text style={styles.attendeesText}>{event.attendees}</Text>
            </View>
          </View>

          {/* Interested Button */}
          <TouchableOpacity
            style={styles.interestedButton}
            onPress={(e) => {
              e.stopPropagation();
              onInterested(event.id);
            }}
            activeOpacity={0.7}
          >
            <Heart size={16} color={Colors.purple} variant="Bold" />
            <Text style={styles.interestedText}>Interested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    alignSelf: 'stretch',
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.backgroundGray,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: '#4CAF50',
    fontWeight: FontWeights.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  price: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: '#4CAF50',
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeesText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  interestedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.purple}15`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  interestedText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
