/**
 * Quick Actions Card Component
 * Card with quick action links
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface QuickActionsCardProps {
  onFavoritesPress: () => void;
}

export default function QuickActionsCard({ onFavoritesPress }: QuickActionsCardProps) {
  const actions = [
    { icon: '✏️', label: 'Edit Profile', onPress: () => {} },
    { icon: '🔒', label: 'Change Password', onPress: () => {} },
    { icon: '🔔', label: 'Notification Preferences', onPress: () => {} },
    { icon: '💝', label: 'My Favorites', onPress: onFavoritesPress },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Actions</Text>
      </View>
      <View style={styles.card}>
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity 
              style={styles.item}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.left}>
                <Text style={styles.icon}>{action.icon}</Text>
                <Text style={styles.label}>{action.label}</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>
            {index < actions.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  item: {
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
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: normalize(16),
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginLeft: Spacing.lg,
  },
});
