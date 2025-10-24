/**
 * All Hidden Gems Page
 * Complete list of hidden gems with filtering, search, and map view
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SearchNormal, Setting4, Location, Category2 } from 'iconsax-react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import HiddenGemListItem from '@/components/discovery/HiddenGemListItem';
import QuickFilters from '@/components/discovery/QuickFilters';
import HiddenGemFilterBottomSheet from '@/components/discovery/HiddenGemFilterBottomSheet';
import { getHiddenGems } from '@/data/discoveryData';
import { HiddenGem, HiddenGemCategory, QuickFilter } from '@/types/discovery';

export default function AllHiddenGemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<QuickFilter[]>([
    { id: 'all', label: 'All', icon: '✨', isActive: true },
    { id: 'scenic', label: 'Views', icon: '🏞️', isActive: false },
    { id: 'cafes', label: 'Cafés', icon: '☕', isActive: false },
    { id: 'restaurants', label: 'Dining', icon: '🍽️', isActive: false },
    { id: 'nature', label: 'Nature', icon: '🌳', isActive: false },
    { id: 'photo', label: 'Photos', icon: '📸', isActive: false },
    { id: 'creative', label: 'Creative', icon: '🎨', isActive: false },
    { id: 'latenight', label: 'Late Night', icon: '🌙', isActive: false },
    { id: 'daytrips', label: 'Day Trips', icon: '🚗', isActive: false },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<HiddenGemCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const allGems = getHiddenGems();

  // Categories
  const categories: (HiddenGemCategory | 'All')[] = [
    'All',
    'Scenic Views',
    'Cozy Cafés',
    'Restaurants',
    'Nature',
    'Photo Spots',
    'Creative Spaces',
    'Late Night',
    'Day Trips',
  ];

  // Filter and sort gems
  const filteredGems = useMemo(() => {
    let filtered = [...allGems];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(gem =>
        gem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gem.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(gem => gem.category === selectedCategory);
    }

    // Filter by open status
    if (showOpenOnly) {
      filtered = filtered.filter(gem => gem.isOpen);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.priceRange.length - b.priceRange.length;
        case 'distance':
        default:
          // Parse distance (e.g., "0.5 mi" -> 0.5)
          const distA = parseFloat(a.distance);
          const distB = parseFloat(b.distance);
          return distA - distB;
      }
    });

    return filtered;
  }, [allGems, searchQuery, selectedCategory, sortBy, showOpenOnly]);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleGemPress = (id: string) => {
    console.log('Gem pressed:', id);
    // TODO: Navigate to gem detail
  };

  const handleSaveGem = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Save gem:', id);
    // TODO: Save to wishlist
  };

  const handleGetDirections = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Get directions to:', id);
    // TODO: Open maps
  };

  const handleFilterPress = (filterId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFilters(filters.map(f => ({
      ...f,
      isActive: f.id === filterId ? !f.isActive : false
    })));
    
    // Map filter ID to category
    const categoryMap: Record<string, HiddenGemCategory | 'All'> = {
      'all': 'All',
      'scenic': 'Scenic Views',
      'cafes': 'Cozy Cafés',
      'restaurants': 'Restaurants',
      'nature': 'Nature',
      'photo': 'Photo Spots',
      'creative': 'Creative Spaces',
      'latenight': 'Late Night',
      'daytrips': 'Day Trips',
    };
    setSelectedCategory(categoryMap[filterId] || 'All');
  };

  const handleViewModeToggle = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };

  const handleFilterSheetPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowFilterSheet(true);
  };

  const handleApplyFilters = (selectedFilters: string[]) => {
    setActiveFilters(selectedFilters);
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const toggleOpenOnly = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowOpenOnly(!showOpenOnly);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header Section */}
      <View style={styles.headerSection}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <View style={styles.backCircle}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
                <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
              </Svg>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hidden Gems</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search Bar & View Toggle */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <SearchNormal size={20} color={Colors.textSecondary} variant="Outline" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hidden gems..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterSheetPress}
            activeOpacity={0.7}
          >
            <Setting4 size={20} color={Colors.text} variant="Outline" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggle, viewMode === 'map' && styles.viewToggleActive]}
            onPress={handleViewModeToggle}
            activeOpacity={0.7}
          >
            {viewMode === 'list' ? (
              <Location size={20} color={Colors.text} variant="Bold" />
            ) : (
              <Category2 size={20} color={Colors.textWhite} variant="Bold" />
            )}
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <QuickFilters
          filters={filters}
          onFilterPress={handleFilterPress}
        />

        {/* Open Now Filter */}
        <View style={styles.openNowRow}>
          <TouchableOpacity
            style={[styles.openToggle, showOpenOnly && styles.openToggleActive]}
            onPress={toggleOpenOnly}
            activeOpacity={0.7}
          >
            <View style={[styles.openDot, showOpenOnly && styles.openDotActive]} />
            <Text style={[styles.openText, showOpenOnly && styles.openTextActive]}>
              Open Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeFilters.length > 0 && (
            <View style={styles.activeFiltersRow}>
              <Text style={styles.activeFiltersText}>
                {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} applied
              </Text>
            </View>
          )}
          {filteredGems.length > 0 ? (
            filteredGems.map((gem) => (
              <HiddenGemListItem
                key={gem.id}
                gem={gem}
                onPress={handleGemPress}
                onSave={handleSaveGem}
                onGetDirections={handleGetDirections}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No hidden gems found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your filters or search query
              </Text>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapTitle}>Map View</Text>
          <Text style={styles.mapText}>
            Map integration coming soon!
          </Text>
        </View>
      )}

      {/* Filter Bottom Sheet */}
      <HiddenGemFilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerSection: {
    backgroundColor: '#FAFAFA',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerRight: {
    width: 44,
    height: 44,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
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
  viewToggle: {
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
  viewToggleActive: {
    backgroundColor: Colors.text,
  },
  openNowRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: '#FAFAFA',
  },
  openToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
  },
  openToggleActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  openDotActive: {
    backgroundColor: '#4CAF50',
  },
  openText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  openTextActive: {
    color: '#4CAF50',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  mapIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  mapTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  mapText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  activeFiltersRow: {
    paddingBottom: Spacing.sm,
  },
  activeFiltersText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
