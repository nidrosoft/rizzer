/**
 * Discovery Header Component
 * Search bar, location selector, and filter button
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SearchNormal, Location, Setting4, Map1 } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface DiscoveryHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onLocationPress: () => void;
  onFilterPress: () => void;
  onMapPress?: () => void;
  currentLocation?: string;
}

export default function DiscoveryHeader({
  searchQuery,
  onSearchChange,
  onLocationPress,
  onFilterPress,
  onMapPress,
  currentLocation = 'Los Angeles, CA',
}: DiscoveryHeaderProps) {
  const handleLocationPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onLocationPress();
  };

  const handleFilterPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFilterPress();
  };

  const handleMapPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMapPress?.();
  };

  return (
    <View style={styles.container}>
      {/* Title and Location */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Discovery</Text>
        <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress} activeOpacity={0.7}>
          <Location size={16} color={Colors.textWhite} variant="Bold" />
          <Text style={styles.locationText} numberOfLines={1}>{currentLocation}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchNormal size={20} color={Colors.textSecondary} variant="Outline" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search date ideas, events, places..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
        {onMapPress && (
          <TouchableOpacity style={styles.mapButton} onPress={handleMapPress} activeOpacity={0.7}>
            <Map1 size={20} color={Colors.text} variant="Outline" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress} activeOpacity={0.7}>
          <Setting4 size={20} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
