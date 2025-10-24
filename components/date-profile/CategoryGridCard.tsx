/**
 * CategoryGridCard Component
 * Square card for profile categories in 2-column grid
 */

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { CategoryCardProps } from '@/types/dateProfile';

export default function CategoryGridCard({ category, onPress }: CategoryCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(category.id);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        {
          backgroundColor: category.bgColor,
          borderColor: category.borderColor,
        }
      ]} 
      activeOpacity={0.7} 
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.iconBg }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={styles.title}>{category.title}</Text>
      <Text style={styles.count}>{category.count} items</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
