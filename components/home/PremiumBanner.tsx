/**
 * PremiumBanner Component
 * Premium upgrade call-to-action banner
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { PremiumCardProps } from '@/types/home';

export default function PremiumBanner({ onUpgrade }: PremiumCardProps) {
  const handleUpgrade = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onUpgrade();
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.premiumCard} onPress={handleUpgrade}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.premiumGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.premiumIcon}>👑</Text>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumSubtitle}>Unlock unlimited features</Text>
          <View style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Get Premium</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  premiumCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.large,
  },
  premiumGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  premiumTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    marginBottom: Spacing.xs,
  },
  premiumSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    opacity: 0.9,
    marginBottom: Spacing.lg,
  },
  premiumButton: {
    backgroundColor: Colors.textWhite,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  premiumButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
  },
});
