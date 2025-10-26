/**
 * RizzCategoriesGrid Component
 * Grid of rizz categories for My Rizz tab
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { RizzCategoriesGridProps } from '@/types/rizz';

export default function RizzCategoriesGrid({ 
  categories, 
  onCategoryPress,
  onCategoryLongPress,
}: RizzCategoriesGridProps) {
  const handlePress = (categoryId: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCategoryPress(categoryId);
  };

  const handleLongPress = (categoryId: number, categoryTitle: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onCategoryLongPress?.(categoryId, categoryTitle);
  };

  // Helper to generate colors from base color
  const getColorsFromBase = (baseColor: string) => {
    return {
      bgColor: `${baseColor}0D`, // 5% opacity
      borderColor: `${baseColor}33`, // 20% opacity
      iconBg: `${baseColor}26`, // 15% opacity
    };
  };

  return (
    <View style={styles.grid}>
      {categories.map((category: any) => {
        // Handle both database format (emoji + color) and mock format (icon component)
        // Database format: has emoji string or no icon component
        // Mock format: has icon component function
        const hasIconComponent = category.icon && typeof category.icon === 'function';
        const isDatabase = !hasIconComponent || typeof category.emoji === 'string';
        
        const colors = isDatabase 
          ? getColorsFromBase(category.color || '#FF6B9D')
          : {
              bgColor: category.bgColor || `${category.color}0D`,
              borderColor: category.borderColor || `${category.color}33`,
              iconBg: category.iconBg || `${category.color}26`,
            };

        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              {
                backgroundColor: colors.bgColor,
                borderColor: colors.borderColor,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => handlePress(category.id)}
            onLongPress={() => handleLongPress(category.id, category.title)}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              {isDatabase ? (
                <Text style={styles.emoji}>{category.emoji || '😊'}</Text>
              ) : hasIconComponent ? (
                (() => {
                  const IconComponent = category.icon;
                  return <IconComponent size={24} color={category.color} variant="Bold" />;
                })()
              ) : (
                <Text style={styles.emoji}>😊</Text>
              )}
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
  emoji: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    lineHeight: 22,
  },
});
