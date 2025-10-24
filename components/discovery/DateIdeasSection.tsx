/**
 * Date Ideas Section Component
 * Personalized date suggestions with stacked cards effect
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import StackedDateIdeaCards from './StackedDateIdeaCards';
import { DateIdea } from '@/types/discovery';

interface DateIdeasSectionProps {
  ideas: DateIdea[];
  onIdeaPress: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
}

export default function DateIdeasSection({ ideas, onIdeaPress, onSave, onShare }: DateIdeasSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>🎪 Date Ideas For You</Text>
        <Text style={styles.subtitle}>Personalized based on your interests</Text>
      </View>
      
      <StackedDateIdeaCards
        ideas={ideas}
        onIdeaPress={onIdeaPress}
        onSave={onSave}
        onShare={onShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: 6,
    marginTop: Spacing.sm,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
