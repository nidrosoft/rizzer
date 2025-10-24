/**
 * All Events Page
 * Complete list of events with filtering and search
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SearchNormal, Setting4 } from 'iconsax-react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import EventListItem from '@/components/discovery/EventListItem';
import QuickFilters from '@/components/discovery/QuickFilters';
import EventFilterBottomSheet from '@/components/discovery/EventFilterBottomSheet';
import { getEvents } from '@/data/discoveryData';
import { Event, EventCategory, QuickFilter } from '@/types/discovery';

export default function AllEventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<QuickFilter[]>([
    { id: 'all', label: 'All', icon: '✨', isActive: true },
    { id: 'concerts', label: 'Music', icon: '🎵', isActive: false },
    { id: 'theater', label: 'Shows', icon: '🎭', isActive: false },
    { id: 'art', label: 'Art', icon: '🎨', isActive: false },
    { id: 'foodwine', label: 'Food', icon: '🍷', isActive: false },
    { id: 'sports', label: 'Sports', icon: '⚽', isActive: false },
    { id: 'nightlife', label: 'Nightlife', icon: '🎉', isActive: false },
    { id: 'festivals', label: 'Festivals', icon: '🎆', isActive: false },
    { id: 'workshops', label: 'Classes', icon: '🛠️', isActive: false },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const allEvents = getEvents();

  // Categories
  const categories: (EventCategory | 'All')[] = [
    'All',
    'Concerts',
    'Theater',
    'Art',
    'Food & Wine',
    'Sports',
    'Nightlife',
    'Festivals',
    'Workshops',
  ];

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.priceValue - b.priceValue;
        case 'popularity':
          return b.attendees - a.attendees;
        case 'date':
        default:
          return 0; // Keep original order for date
      }
    });

    return filtered;
  }, [allEvents, searchQuery, selectedCategory, sortBy]);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleEventPress = (id: string) => {
    console.log('Event pressed:', id);
    // TODO: Navigate to event detail
  };

  const handleInterested = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    console.log('Interested in event:', id);
    // TODO: Mark as interested
  };

  const handleQuickFilterPress = (filterId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFilters(filters.map(f => ({
      ...f,
      isActive: f.id === filterId ? !f.isActive : false
    })));
    
    // Map filter ID to category
    const categoryMap: Record<string, EventCategory | 'All'> = {
      'all': 'All',
      'concerts': 'Concerts',
      'theater': 'Theater',
      'art': 'Art',
      'foodwine': 'Food & Wine',
      'sports': 'Sports',
      'nightlife': 'Nightlife',
      'festivals': 'Festivals',
      'workshops': 'Workshops',
    };
    setSelectedCategory(categoryMap[filterId] || 'All');
  };

  const handleFilterPress = () => {
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
          <Text style={styles.headerTitle}>All Events</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <SearchNormal size={20} color={Colors.textSecondary} variant="Outline" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Setting4 size={20} color={Colors.text} variant="Outline" />
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <QuickFilters
          filters={filters}
          onFilterPress={handleQuickFilterPress}
        />
      </View>

      {/* Events List */}
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
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onPress={handleEventPress}
              onInterested={handleInterested}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or search query
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <EventFilterBottomSheet
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
  activeFiltersRow: {
    paddingBottom: Spacing.sm,
  },
  activeFiltersText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
