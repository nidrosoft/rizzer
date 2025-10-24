/**
 * Reusable Plus Button (FAB) Component
 * Floating Action Button with horizontal gradient background
 * Standard component for creating new items across the app
 * Matches Rizz page FAB exactly
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Add } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing } from '@/constants/theme';

interface PlusButtonProps {
  onPress: () => void;
}

export default function PlusButton({ onPress }: PlusButtonProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Add size={28} color={Colors.textWhite} variant="Bold" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
