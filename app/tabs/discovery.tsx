/**
 * Discovery Screen
 * Main hub for discovering date ideas, events, hidden gems, and planning dates
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Calendar } from 'iconsax-react-native';
import { useToast } from '@/contexts/ToastContext';
import { Colors, Spacing } from '@/constants/theme';

// Components
import DiscoveryHeader from '@/components/discovery/DiscoveryHeader';
import QuickFilters from '@/components/discovery/QuickFilters';
import DateIdeasSection from '@/components/discovery/DateIdeasSection';
import EventsSection from '@/components/discovery/EventsSection';
import HiddenGemsSection from '@/components/discovery/HiddenGemsSection';
import DatePlannerSection from '@/components/discovery/DatePlannerSection';
import LocationBottomSheet from '@/components/discovery/LocationBottomSheet';
import FilterBottomSheet from '@/components/discovery/FilterBottomSheet';

// Data
import { getDateIdeas, getEvents, getHiddenGems, getQuickFilters } from '@/data/discoveryData';

export default function DiscoveryScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(getQuickFilters());
  const [currentLocation, setCurrentLocation] = useState('Los Angeles, CA');
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Data
  const dateIdeas = getDateIdeas(); // Show all for stacked effect
  const events = getEvents();
  const hiddenGems = getHiddenGems();

  // Handlers
  const handleLocationPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowLocationSheet(true);
  };

  const handleSaveLocation = (location: string) => {
    setCurrentLocation(location);
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show toast
    showToast(`Location updated to ${location}`, 'success');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate data refresh (in real app, this would fetch new data)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Success haptic
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setRefreshing(false);
    
    // Show success toast
    showToast('Showing latest recommendations', 'success');
  };

  const handleFilterPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowFilterSheet(true);
  };

  const handleMapPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/discovery/map-view');
  };

  const handleMyEventsPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/events/my-events');
  };

  const handleApplyFilters = (selectedFilters: string[]) => {
    setActiveFilters(selectedFilters);
    
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show toast
    if (selectedFilters.length > 0) {
      showToast(`${selectedFilters.length} filter${selectedFilters.length > 1 ? 's' : ''} applied`, 'success');
    }
  };

  const handleQuickFilterPress = (filterId: string) => {
    setFilters(filters.map(f => ({
      ...f,
      isActive: f.id === filterId ? !f.isActive : false
    })));
  };

  const handleDateIdeaPress = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/discovery/date-idea/${id}`);
  };

  const handleSaveDateIdea = (id: string) => {
    console.log('Save date idea:', id);
    // TODO: Save to favorites
  };

  const handleShareDateIdea = (id: string) => {
    console.log('Share date idea:', id);
    // TODO: Share functionality
  };

  const handleEventPress = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/events/${id}`);
  };

  const handleEventInterested = (id: string) => {
    console.log('Interested in event:', id);
    // TODO: Mark as interested
  };

  const handleShareEvent = (id: string) => {
    console.log('Share event:', id);
    // TODO: Share functionality
  };

  const handleGemPress = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/discovery/hidden-gem/${id}`);
  };

  const handleSaveGem = (id: string) => {
    console.log('Save gem:', id);
    // TODO: Save to wishlist
  };

  const handleGetDirections = (id: string) => {
    console.log('Get directions to:', id);
    // TODO: Open maps
  };

  const handleDatePlannerPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/discovery/date-planner');
  };

  const handleSeeAllEvents = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/discovery/all-events');
  };

  const handleSeeAllGems = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/discovery/all-gems');
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header with Gradient (extends to status bar) */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.gradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <SafeAreaView edges={['top']}>
            <DiscoveryHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLocationPress={handleLocationPress}
              onFilterPress={handleFilterPress}
              onMapPress={handleMapPress}
              currentLocation={currentLocation}
            />
          </SafeAreaView>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FE3C72"
              colors={['#FE3C72', '#FF7854']}
              progressBackgroundColor={Colors.background}
              titleColor={Colors.textSecondary}
            />
          }
        >
        {/* Quick Filters */}
        <QuickFilters
          filters={filters}
          onFilterPress={handleQuickFilterPress}
        />

        {/* Date Ideas Section */}
        <DateIdeasSection
          ideas={dateIdeas}
          onIdeaPress={handleDateIdeaPress}
          onSave={handleSaveDateIdea}
          onShare={handleShareDateIdea}
        />

        {/* Events Section */}
        <EventsSection
          events={events}
          onEventPress={handleEventPress}
          onInterested={handleEventInterested}
          onShare={handleShareEvent}
          onSeeAll={handleSeeAllEvents}
        />

        {/* Hidden Gems Section */}
        <HiddenGemsSection
          gems={hiddenGems}
          onGemPress={handleGemPress}
          onSave={handleSaveGem}
          onGetDirections={handleGetDirections}
          onSeeAll={handleSeeAllGems}
        />

        {/* Date Planner CTA */}
        <DatePlannerSection onPress={handleDatePlannerPress} />

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

        {/* Location Bottom Sheet */}
        <LocationBottomSheet
          visible={showLocationSheet}
          currentLocation={currentLocation}
          onClose={() => setShowLocationSheet(false)}
          onSave={handleSaveLocation}
        />

        {/* Filter Bottom Sheet */}
        <FilterBottomSheet
          visible={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          onApply={handleApplyFilters}
        />

        {/* Floating My Events Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.8}
          onPress={handleMyEventsPress}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.floatingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Calendar size={28} color={Colors.textWhite} variant="Bold" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  gradientHeader: {
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
