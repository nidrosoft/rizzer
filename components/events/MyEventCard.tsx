/**
 * My Event Card Component
 * Event card for My Events list
 * MAX 140 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Calendar, Location, Share } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { Event, RSVPStatus } from '@/types/events';

interface MyEventCardProps {
  event: Event;
  rsvpStatus: RSVPStatus;
  onPress: () => void;
  onCalendar: () => void;
  onDirections: () => void;
  onShare: () => void;
}

export default function MyEventCard({
  event,
  rsvpStatus,
  onPress,
  onCalendar,
  onDirections,
  onShare,
}: MyEventCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getStatusBadge = () => {
    switch (rsvpStatus) {
      case 'going':
        return { label: 'Going', color: '#4CAF50', emoji: '✅' };
      case 'interested':
        return { label: 'Interested', color: '#FFA500', emoji: '⭐' };
      case 'not_going':
        return { label: "Can't Go", color: '#9E9E9E', emoji: '❌' };
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const badge = getStatusBadge();

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{event.image}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: `${badge.color}15` }]}>
              <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoRow}>
          <Calendar size={14} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.infoText}>{formatDate(event.date)} • {event.startTime}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Location size={14} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.infoText} numberOfLines={1}>{event.location.name}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onCalendar}>
            <Calendar size={18} color={Colors.purple} variant="Bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDirections}>
            <Location size={18} color={Colors.purple} variant="Bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Share size={18} color={Colors.purple} variant="Bold" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
  },
  badgeEmoji: {
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.purple}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
