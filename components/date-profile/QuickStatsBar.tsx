/**
 * QuickStatsBar Component
 * Displays quick statistics about the relationship
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { QuickStatsBarProps } from '@/types/dateProfile';

export default function QuickStatsBar({ stats }: QuickStatsBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.daysTogether}</Text>
        <Text style={styles.statLabel}>Days Together</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.totalDates}</Text>
        <Text style={styles.statLabel}>Dates</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{stats.memoriesCount}</Text>
        <Text style={styles.statLabel}>Memories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
