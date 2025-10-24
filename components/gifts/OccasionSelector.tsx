/**
 * OccasionSelector Component for Gifts feature
 * Displays list of occasion options
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { OccasionType } from '@/types/gifts';
import { GiftsConfig } from '@/constants/gifts';
import SectionHeader from '@/components/ui/SectionHeader';
import OccasionCard from './OccasionCard';

interface OccasionSelectorProps {
  selectedOccasion: OccasionType | null;
  onOccasionSelect: (occasionId: OccasionType) => void;
}

export default function OccasionSelector({ selectedOccasion, onOccasionSelect }: OccasionSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <SectionHeader
        title="Select Occasion"
        subtitle="What's the reason for this gift?"
      />

      {/* Occasion List */}
      <View style={styles.list}>
        {GiftsConfig.occasions.map((occasion) => (
          <OccasionCard
            key={occasion.id}
            occasion={occasion}
            isSelected={selectedOccasion === occasion.id}
            onPress={onOccasionSelect}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  list: {
    gap: 0,
  },
});
