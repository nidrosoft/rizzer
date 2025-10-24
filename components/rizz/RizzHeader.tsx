/**
 * RizzHeader Component
 * Simple header with title (now with white text for gradient background)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { RizzHeaderProps } from '@/types/rizz';

export default function RizzHeader({ title }: RizzHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
