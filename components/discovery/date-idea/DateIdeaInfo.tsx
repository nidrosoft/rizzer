/**
 * Date Idea Info Component
 * Category badge, rating, title, and quick info cards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Clock, DollarCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface DateIdeaInfoProps {
  category: string;
  rating: number;
  reviewCount: number;
  title: string;
  duration: string;
  estimatedCost: string;
  difficulty: string;
}

export default function DateIdeaInfo({
  category,
  rating,
  reviewCount,
  title,
  duration,
  estimatedCost,
  difficulty,
}: DateIdeaInfoProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return '#4CAF50';
      case 'Moderate': return '#FFA500';
      case 'Hard': return '#F44336';
      default: return Colors.textSecondary;
    }
  };

  return (
    <>
      {/* Category Badge + Rating */}
      <View style={styles.categoryBadgeContainer}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.categoryBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </LinearGradient>
        
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>⭐ {rating}</Text>
          <Text style={styles.reviews}>({reviewCount} reviews)</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      {/* Quick Info Cards */}
      <View style={styles.quickInfoSection}>
        <View style={styles.infoCard}>
          <Clock size={20} color={Colors.purple} variant="Bold" />
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{duration}</Text>
        </View>
        <View style={styles.infoCard}>
          <DollarCircle size={20} color={Colors.purple} variant="Bold" />
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.infoValue}>{estimatedCost}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.difficultyIcon}>🎯</Text>
          <Text style={styles.infoLabel}>Difficulty</Text>
          <Text style={[styles.infoValue, { color: getDifficultyColor(difficulty) }]}>
            {difficulty}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  categoryBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryText: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
    textTransform: 'capitalize',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: normalize(14),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  reviews: {
    fontSize: normalize(11),
    color: Colors.textSecondary,
  },
  titleContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: normalize(28),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  quickInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  difficultyIcon: {
    fontSize: 20,
  },
  infoLabel: {
    fontSize: normalize(11),
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  infoValue: {
    fontSize: normalize(14),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: 2,
  },
});
