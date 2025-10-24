/**
 * Event Title Component
 * Event title with rating
 * MAX 70 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star1 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface EventTitleProps {
  title: string;
  rating: number;
  reviewCount: number;
}

export default function EventTitle({ title, rating, reviewCount }: EventTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.ratingRow}>
        <Star1 size={16} color="#FFA500" variant="Bold" />
        <Text style={styles.rating}>{rating}</Text>
        <Text style={styles.reviews}>({reviewCount} reviews)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  reviews: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
