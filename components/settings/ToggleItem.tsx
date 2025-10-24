/**
 * Toggle Item Component
 * Setting row with toggle switch
 */

import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface ToggleItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
}

export default function ToggleItem({
  icon,
  label,
  description,
  value,
  onValueChange,
  showDivider = true,
}: ToggleItemProps) {
  const handleToggle = (newValue: boolean) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(newValue);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.left}>
          {icon}
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={handleToggle}
          trackColor={{ 
            false: Colors.borderLight, 
            true: Colors.purple 
          }}
          thumbColor={Colors.background}
          ios_backgroundColor={Colors.borderLight}
        />
      </View>
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
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: normalize(16),
    color: Colors.text,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  description: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(16),
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginLeft: Spacing.lg + 22 + Spacing.md,
  },
});
