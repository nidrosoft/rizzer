/**
 * QuickActionsBar Component
 * Horizontal scrollable quick action cards
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { ActionCardsProps } from '@/types/home';

export default function QuickActionsBar({ actions, onActionPress }: ActionCardsProps) {
  const handlePress = (action: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onActionPress?.(action);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Do it right..</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionCard,
                {
                  backgroundColor: action.bgColor,
                  borderColor: action.borderColor,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handlePress(action)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.iconBg }]}>
                <IconComponent size={20} color={action.color} variant="Bold" />
              </View>
              <Text style={styles.actionCardTitle} numberOfLines={2}>
                {action.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  actionCard: {
    width: 160,
    height: 120,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    lineHeight: 20,
  },
});
