/**
 * RizzCategoriesGrid Component
 * Grid of rizz categories for My Rizz tab
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { RizzCategoriesGridProps } from '@/types/rizz';

export default function RizzCategoriesGrid({ categories, onCategoryPress }: RizzCategoriesGridProps) {
  const handlePress = (categoryId: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCategoryPress(categoryId);
  };

  return (
    <View style={styles.grid}>
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              {
                backgroundColor: category.bgColor,
                borderColor: category.borderColor,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => handlePress(category.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.iconBg }]}>
              <IconComponent size={24} color={category.color} variant="Bold" />
            </View>
            <Text style={styles.categoryTitle} numberOfLines={2}>
              {category.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    lineHeight: 22,
  },
});
