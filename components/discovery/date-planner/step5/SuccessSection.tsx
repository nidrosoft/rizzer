/**
 * Success Section Component
 * Success icon, title, and subtitle
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface SuccessSectionProps {
  title: string;
  activityCount: number;
}

export default function SuccessSection({ title, activityCount }: SuccessSectionProps) {
  return (
    <>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎉</Text>
      </View>

      <Text style={styles.title}>Your Date Plan is Ready!</Text>
      <Text style={styles.subtitle}>
        {title} • {activityCount} activities
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: normalize(28),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
});
