/**
 * Date Planner Section Component
 * AI-powered date itinerary builder CTA
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { MagicStar, ArrowRight } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface DatePlannerSectionProps {
  onPress: () => void;
}

export default function DatePlannerSection({ onPress }: DatePlannerSectionProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.iconContainer}>
            <MagicStar size={32} color={Colors.textWhite} variant="Bold" />
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title}>💡 AI Date Planner</Text>
            <Text style={styles.description}>
              Let AI create the perfect date itinerary in seconds
            </Text>
            
            <View style={styles.features}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✨</Text>
                <Text style={styles.featureText}>Personalized to your interests</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🗺️</Text>
                <Text style={styles.featureText}>Complete with route & timing</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>💰</Text>
                <Text style={styles.featureText}>Budget-friendly options</Text>
              </View>
            </View>
          </View>

          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Create Date Plan</Text>
            <ArrowRight size={20} color={Colors.textWhite} variant="Outline" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  gradient: {
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  content: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  features: {
    gap: Spacing.sm,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    fontSize: FontSizes.sm,
    color: Colors.textWhite,
    opacity: 0.95,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.text,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
