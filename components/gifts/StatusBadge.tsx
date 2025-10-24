/**
 * StatusBadge Component for Gifts feature
 * Displays investigation status with appropriate styling
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftsConfig } from '@/constants/gifts';
import { FontSizes, FontWeights, BorderRadius, Spacing } from '@/constants/theme';
import { StatusBadgeProps } from '@/types/gifts';

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const config = GiftsConfig.statusConfig[status];
  const isSmall = size === 'small';

  return (
    <View 
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        isSmall && styles.badgeSmall,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }, isSmall && styles.textSmall]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  textSmall: {
    fontSize: 10,
  },
});
