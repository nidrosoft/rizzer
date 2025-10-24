/**
 * SourceToggle Component for Gifts feature
 * Toggles between phone contacts and app users
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { ContactSource } from '@/types/gifts';
import { GiftsConfig } from '@/constants/gifts';

interface SourceToggleProps {
  activeSource: ContactSource | 'all';
  onSourceChange: (source: ContactSource | 'all') => void;
}

export default function SourceToggle({ activeSource, onSourceChange }: SourceToggleProps) {
  const handlePress = (source: ContactSource | 'all') => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSourceChange(source);
  };

  const sources: Array<{ key: ContactSource | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'phone', label: GiftsConfig.contactSources.phone },
    { key: 'app', label: GiftsConfig.contactSources.app },
  ];

  return (
    <View style={styles.container}>
      {sources.map((source) => (
        <TouchableOpacity
          key={source.key}
          style={[styles.button, activeSource === source.key && styles.buttonActive]}
          onPress={() => handlePress(source.key)}
          activeOpacity={0.7}
        >
          {source.key === 'app' && activeSource === source.key ? (
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.gradientText}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.buttonText, styles.buttonTextGradient]}>
                {source.label}
              </Text>
            </LinearGradient>
          ) : (
            <Text style={[
              styles.buttonText, 
              activeSource === source.key && styles.buttonTextActive,
              source.key === 'app' && activeSource !== source.key && styles.appUserInactive
            ]}>
              {source.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs - 2,
    gap: Spacing.xs - 2,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  buttonTextActive: {
    color: Colors.purple,
  },
  gradientText: {
    borderRadius: BorderRadius.sm,
  },
  buttonTextGradient: {
    color: Colors.textWhite,
  },
  appUserInactive: {
    color: Colors.gradientStart,
  },
});
