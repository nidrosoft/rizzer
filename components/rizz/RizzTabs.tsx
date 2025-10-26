/**
 * RizzTabs Component
 * Tab switcher for My Rizz and Rizz Coach
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { RizzTabsProps } from '@/types/rizz';

export default function RizzTabs({ activeTab, onTabChange }: RizzTabsProps) {
  const handleTabPress = (tab: 'myRizz' | 'geniusRizz') => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onTabChange(tab);
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handleTabPress('myRizz')}
      >
        <Text style={[styles.tabText, activeTab === 'myRizz' && styles.activeTabText]}>
          My Rizz
        </Text>
        {activeTab === 'myRizz' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => handleTabPress('geniusRizz')}
      >
        <Text style={[styles.tabText, activeTab === 'geniusRizz' && styles.activeTabText]}>
          Rizz Coach
        </Text>
        {activeTab === 'geniusRizz' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeTabText: {
    color: Colors.textWhite,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.textWhite,
    borderRadius: 2,
  },
});
