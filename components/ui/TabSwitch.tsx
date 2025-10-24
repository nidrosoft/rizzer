/**
 * Reusable TabSwitch Component
 * Can be used across all features (Rizz, Gifts, etc.)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface Tab {
  key: string;
  label: string;
}

interface TabSwitchProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  variant?: 'default' | 'light'; // light variant for gradient backgrounds
}

export default function TabSwitch({ tabs, activeTab, onTabChange, variant = 'default' }: TabSwitchProps) {
  const isLight = variant === 'light';
  const handleTabPress = (tabKey: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onTabChange(tabKey);
  };

  return (
    <View style={[styles.container, isLight && styles.containerLight]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => handleTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            isLight && styles.tabTextLight,
            activeTab === tab.key && (isLight ? styles.activeTabTextLight : styles.activeTabText)
          ]}>
            {tab.label}
          </Text>
          {activeTab === tab.key && <View style={[styles.tabIndicator, isLight && styles.tabIndicatorLight]} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  containerLight: {
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  tabTextLight: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: Colors.purple,
  },
  activeTabTextLight: {
    color: Colors.textWhite,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.purple,
    borderRadius: 2,
  },
  tabIndicatorLight: {
    backgroundColor: Colors.textWhite,
  },
});
