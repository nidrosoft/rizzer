/**
 * Regenerate FAB Component
 * Floating action button for generating more rizz lines
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { MagicStar } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface RegenerateFABProps {
  onPress: () => void;
  isGenerating?: boolean;
  hasExistingLines?: boolean;
}

export default function RegenerateFAB({ onPress, isGenerating = false, hasExistingLines = false }: RegenerateFABProps) {
  const handlePress = () => {
    if (isGenerating) return;
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity 
      style={[styles.fab, isGenerating && styles.fabDisabled]}
      onPress={handlePress}
      activeOpacity={isGenerating ? 1 : 0.9}
      disabled={isGenerating}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <MagicStar size={24} color={Colors.textWhite} variant="Bold" />
        <Text style={styles.text}>
          {isGenerating ? 'Generating...' : hasExistingLines ? 'More Rizz' : 'Generate Rizz'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xxl,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabDisabled: {
    opacity: 0.6,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  text: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
