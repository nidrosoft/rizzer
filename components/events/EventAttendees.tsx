/**
 * Event Attendees Component
 * Shows going and interested counts
 * MAX 80 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface EventAttendeesProps {
  going: number;
  interested: number;
}

export default function EventAttendees({ going, interested }: EventAttendeesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Attendees</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{going.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Going</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{interested.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Interested</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
