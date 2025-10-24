/**
 * Date Idea Actions Component
 * Sticky footer with Plan This Date button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Calendar } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface DateIdeaActionsProps {
  onPlanDate: () => void;
}

export default function DateIdeaActions({ onPlanDate }: DateIdeaActionsProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPlanDate();
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.bookGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Calendar size={20} color={Colors.textWhite} variant="Bold" />
          <Text style={styles.bookText}>Plan This Date</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bookButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  bookGradient: {
    flexDirection: 'row',
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  bookText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
