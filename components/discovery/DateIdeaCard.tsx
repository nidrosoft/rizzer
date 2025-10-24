/**
 * Date Idea Card Component
 * Swipeable card showing personalized date suggestions
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Heart, Share, Clock, DollarCircle, Location } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { DateIdeaCardProps } from '@/types/discovery';

export default function DateIdeaCard({ idea, onPress, onSave, onShare }: DateIdeaCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(idea.id);
  };

  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSave(idea.id);
  };

  const handleShare = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare(idea.id);
  };

  const getBudgetColor = () => {
    switch (idea.budget) {
      case '$': return '#10B981';
      case '$$': return '#F59E0B';
      case '$$$': return '#EF4444';
      default: return Colors.textSecondary;
    }
  };

  const getDifficultyColor = () => {
    switch (idea.difficulty) {
      case 'Easy': return '#10B981';
      case 'Moderate': return '#F59E0B';
      case 'Adventurous': return '#EF4444';
      default: return Colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      {/* Image/Icon Section */}
      <View style={styles.imageContainer}>
        <Text style={styles.imageIcon}>{idea.image}</Text>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        
        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave} activeOpacity={0.7}>
            <Heart size={20} color={Colors.textWhite} variant="Bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.7}>
            <Share size={20} color={Colors.textWhite} variant="Outline" />
          </TouchableOpacity>
        </View>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{idea.category}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{idea.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{idea.description}</Text>

        {/* Match Reason */}
        {idea.matchReason && (
          <View style={styles.matchReason}>
            <Text style={styles.matchReasonIcon}>✨</Text>
            <Text style={styles.matchReasonText} numberOfLines={1}>{idea.matchReason}</Text>
          </View>
        )}

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={14} color={Colors.textSecondary} variant="Outline" />
            <Text style={styles.infoText}>{idea.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <DollarCircle size={14} color={getBudgetColor()} variant="Bold" />
            <Text style={[styles.infoText, { color: getBudgetColor() }]}>{idea.budget}</Text>
          </View>
          <View style={styles.infoItem}>
            <Location size={14} color={Colors.textSecondary} variant="Outline" />
            <Text style={styles.infoText}>{idea.isIndoor ? 'Indoor' : 'Outdoor'}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          {idea.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handlePress} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Plan This Date</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    height: 200,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageIcon: {
    fontSize: 80,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  actions: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  matchReason: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(171, 71, 188, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  matchReasonIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  matchReasonText: {
    flex: 1,
    fontSize: FontSizes.xs,
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tag: {
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  tagText: {
    fontSize: FontSizes.xs,
    color: Colors.text,
  },
  ctaButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
