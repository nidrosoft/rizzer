/**
 * Events Empty State Component
 * Empty state for no events
 * MAX 80 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface EventsEmptyStateProps {
  type: 'upcoming' | 'past';
  onExplore: () => void;
}

export default function EventsEmptyState({ type, onExplore }: EventsEmptyStateProps) {
  const content = type === 'upcoming' 
    ? {
        emoji: '🎉',
        title: 'No Upcoming Events',
        message: 'Discover amazing events happening in your area!',
        buttonText: 'Explore Events',
      }
    : {
        emoji: '📅',
        title: 'No Past Events',
        message: 'Events you attended will appear here.',
        buttonText: 'Find Events',
      };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{content.emoji}</Text>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.message}>{content.message}</Text>
      <TouchableOpacity style={styles.button} onPress={onExplore} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{content.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
