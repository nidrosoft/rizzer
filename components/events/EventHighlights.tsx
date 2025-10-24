/**
 * Event Highlights Component
 * List of event highlights
 * MAX 80 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TickCircle, Lamp } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface EventHighlightsProps {
  highlights: string[];
}

export default function EventHighlights({ highlights }: EventHighlightsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Lamp size={20} color={Colors.textSecondary} variant="Outline" />
        </View>
        <Text style={styles.sectionTitle}>Event Highlights</Text>
      </View>
      {highlights.map((highlight, index) => (
        <View key={index} style={styles.highlightItem}>
          <TickCircle size={20} color="#10B981" variant="Bold" />
          <Text style={styles.highlightText}>{highlight}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  highlightItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  highlightText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
});
