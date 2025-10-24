/**
 * Setting Item Component
 * Reusable setting row with icon, label, and optional badge
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowRight2 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
  danger?: boolean;
  showDivider?: boolean;
}

export default function SettingItem({
  icon,
  label,
  onPress,
  badge,
  badgeColor,
  danger = false,
  showDivider = true,
}: SettingItemProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.left}>
          {icon}
          <Text style={[styles.label, danger && styles.labelDanger]}>
            {label}
          </Text>
        </View>
        <View style={styles.right}>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badgeColor || Colors.purple }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
          <ArrowRight2 
            size={20} 
            color={danger ? Colors.error : Colors.textSecondary} 
            variant="Outline" 
          />
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  label: {
    fontSize: normalize(16),
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  labelDanger: {
    color: Colors.error,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: normalize(11),
    color: Colors.textWhite,
    fontWeight: FontWeights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginLeft: Spacing.lg + 22 + Spacing.md,
  },
});
