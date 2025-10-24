/**
 * Quick Filters Component
 * Horizontal scrollable filter chips
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { QuickFilter } from '@/types/discovery';

interface QuickFiltersProps {
  filters: QuickFilter[];
  onFilterPress: (filterId: string) => void;
}

export default function QuickFilters({ filters, onFilterPress }: QuickFiltersProps) {
  const handleFilterPress = (filterId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFilterPress(filterId);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[styles.chip, filter.isActive && styles.chipActive]}
          onPress={() => handleFilterPress(filter.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{filter.icon}</Text>
          <Text style={[styles.label, filter.isActive && styles.labelActive]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 36,
  },
  chipActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  icon: {
    fontSize: 16,
    lineHeight: 16,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    lineHeight: 16,
  },
  labelActive: {
    color: Colors.textWhite,
  },
});
