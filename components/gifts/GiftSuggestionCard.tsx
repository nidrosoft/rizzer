/**
 * GiftSuggestionCard Component
 * Displays individual gift suggestion with details
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Star1, ShoppingCart, ExportSquare, Heart } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { GiftSuggestionCardProps } from '@/types/gifts';

export default function GiftSuggestionCard({ suggestion, onPress }: GiftSuggestionCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(suggestion);
  };

  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsSaved(!isSaved);
    // TODO: Save to backend
  };

  const handleBuyPress = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (suggestion.purchaseUrl) {
      await Linking.openURL(suggestion.purchaseUrl);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 75) return GiftsConfig.gradient.start;
    return Colors.warning;
  };

  const matchColor = getMatchColor(suggestion.matchScore);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        {/* Match Score Badge */}
        <View style={[styles.matchBadge, { backgroundColor: `${matchColor}15` }]}>
          <Star1 size={14} color={matchColor} variant="Bold" />
          <Text style={[styles.matchScore, { color: matchColor }]}>
            {suggestion.matchScore}% Match
          </Text>
        </View>

        {/* Image Placeholder */}
        <View style={styles.imagePlaceholder}>
          <LinearGradient
            colors={[GiftsConfig.gradient.start, GiftsConfig.gradient.end]}
            style={styles.imageGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ShoppingCart size={40} color={Colors.textWhite} variant="Bold" />
          </LinearGradient>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {suggestion.title}
            </Text>
            <Text style={styles.price}>{suggestion.price}</Text>
          </View>

          {/* Category */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{suggestion.category}</Text>
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {suggestion.description}
          </Text>

          {/* Reasoning */}
          <View style={styles.reasoningContainer}>
            <Text style={styles.reasoningLabel}>Why this gift:</Text>
            <Text style={styles.reasoning} numberOfLines={3}>
              {suggestion.reasoning}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, isSaved && styles.saveButtonActive]}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Heart 
                size={20} 
                color={isSaved ? Colors.textWhite : GiftsConfig.gradient.start} 
                variant={isSaved ? "Bold" : "Outline"}
              />
              <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
                {isSaved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            {/* Where to Buy Button */}
            {suggestion.purchaseUrl && (
              <TouchableOpacity
                style={styles.buyButton}
                onPress={handleBuyPress}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[GiftsConfig.gradient.start, GiftsConfig.gradient.end]}
                  style={styles.buyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buyButtonText}>Where to Buy</Text>
                  <ExportSquare size={18} color={Colors.textWhite} variant="Bold" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  matchBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  matchScore: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.backgroundGray,
  },
  imageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs - 2,
    lineHeight: 24,
  },
  price: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: GiftsConfig.gradient.start,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  reasoningContainer: {
    backgroundColor: `${GiftsConfig.gradient.start}08`,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: GiftsConfig.gradient.start,
  },
  reasoningLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: GiftsConfig.gradient.start,
    marginBottom: Spacing.xs - 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasoning: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: GiftsConfig.gradient.start,
    backgroundColor: Colors.background,
  },
  saveButtonActive: {
    backgroundColor: GiftsConfig.gradient.start,
    borderColor: GiftsConfig.gradient.start,
  },
  saveButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: GiftsConfig.gradient.start,
  },
  saveButtonTextActive: {
    color: Colors.textWhite,
  },
  buyButton: {
    flex: 2,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  buyButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
