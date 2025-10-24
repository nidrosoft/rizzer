/**
 * Hidden Gems Section Component
 * Local spots and places to discover
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import HiddenGemCard from './HiddenGemCard';
import { HiddenGem } from '@/types/discovery';

interface HiddenGemsSectionProps {
  gems: HiddenGem[];
  onGemPress: (id: string) => void;
  onSave: (id: string) => void;
  onGetDirections: (id: string) => void;
  onSeeAll: () => void;
}

export default function HiddenGemsSection({ gems, onGemPress, onSave, onGetDirections, onSeeAll }: HiddenGemsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🗺️ Hidden Gems</Text>
          <Text style={styles.subtitle}>Unique spots locals love</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See All</Text>
          <ArrowRight2 size={16} color={Colors.purple} variant="Outline" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {gems.map((gem) => (
          <HiddenGemCard
            key={gem.id}
            gem={gem}
            onPress={onGemPress}
            onSave={onSave}
            onGetDirections={onGetDirections}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
});
