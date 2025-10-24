/**
 * OccasionCard Component for Gifts feature
 * Displays individual occasion option
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TickCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { OccasionCardProps } from '@/types/gifts';

export default function OccasionCard({ occasion, isSelected, onPress }: OccasionCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(occasion.id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
        <Text style={styles.icon}>{occasion.icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.label}>{occasion.label}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {occasion.description}
        </Text>
      </View>

      {/* Selection Indicator */}
      {isSelected && (
        <View style={styles.checkmark}>
          <TickCircle size={24} color={Colors.purple} variant="Bold" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  cardSelected: {
    borderColor: Colors.purple,
    borderWidth: 2,
    backgroundColor: `${Colors.purple}05`,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: `${Colors.purple}15`,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  checkmark: {
    marginLeft: Spacing.sm,
  },
});
