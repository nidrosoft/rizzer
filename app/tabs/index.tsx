/**
 * Home Screen - Refactored with Modular Architecture
 * Main dashboard with date profiles, rizz, events, and premium upgrade
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import DateProfileIntroModal from '@/components/DateProfileIntroModal';
import { useToast } from '@/contexts/ToastContext';
import { useDateProfileStore } from '@/store/dateProfileStore';
import { useAuthStore } from '@/store/authStore';
import { fetchUserDateProfiles } from '@/lib/dateProfiles';

// Modular Components
import HomeHeader from '@/components/home/HomeHeader';
import StatsOverview from '@/components/home/StatsOverview';
import InterestTagsBar from '@/components/home/InterestTagsBar';
import QuickActionsBar from '@/components/home/QuickActionsBar';
import TodaysAgenda from '@/components/home/TodaysAgenda';
import DateProfilesGallery from '@/components/home/DateProfilesGallery';
import QuickInsights from '@/components/home/QuickInsights';
import RizzLibrary from '@/components/home/RizzLibrary';
import EventsCalendar from '@/components/home/EventsCalendar';
import FavoritesCard from '@/components/home/FavoritesCard';

// Data
import {
  getInterestCategories,
  getQuickActions,
  getRizzLibrary,
  getUpcomingEvents,
} from '@/data/homeData';

// UI Components
import SearchBar from '@/components/ui/SearchBar';
import DateProfilesLoading from '@/components/home/DateProfilesLoading';
import DateProfileFilterSheet from '@/components/home/DateProfileFilterSheet';

export default function HomeScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // Auth & User
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || 'There';
  
  // Date Profiles Store
  const {
    profiles,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    filterStatus,
    sortBy,
    setProfiles,
    setLoading,
    setRefreshing,
    setError,
    setSearchQuery,
    setFilterStatus,
    setSortBy,
    getFilteredProfiles,
  } = useDateProfileStore();
  
  // Local State
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Get filtered profiles and transform to home format
  const filteredProfiles = getFilteredProfiles().map((profile) => ({
    id: profile.id,
    name: profile.basicInfo.name,
    age: profile.basicInfo.age,
    photo: profile.basicInfo.photo,
    profession: profile.basicInfo.profession,
  }));

  // Load profiles from database
  const loadProfiles = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { success, data, error: fetchError } = await fetchUserDateProfiles(user.id);
      
      if (success && data) {
        setProfiles(data);
        setError(null);
      } else {
        setError(fetchError || 'Failed to load profiles');
        showToast(fetchError || 'Failed to load profiles', 'error');
      }
    } catch (err: any) {
      console.error('Error loading profiles:', err);
      setError(err.message);
      showToast('Failed to load profiles', 'error');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [user?.id]);
  
  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);
  
  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setRefreshing(true);
      const { success, data, error: fetchError } = await fetchUserDateProfiles(user.id);
      
      if (success && data) {
        setProfiles(data);
        setError(null);
        showToast('Profiles refreshed', 'success');
      } else {
        setError(fetchError || 'Failed to refresh');
      }
    } catch (err: any) {
      console.error('Error refreshing profiles:', err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);
  
  // Handlers
  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  const handleNewDateProfile = () => {
    setShowIntroModal(true);
  };

  const handleContinueToFlow = () => {
    setShowIntroModal(false);
    router.push('/date-profile/basic-info');
  };

  const handleProfilePress = (profileId: string) => {
    console.log('Profile pressed:', profileId);
    router.push(`/date-profile/${profileId}`);
  };

  const handleCategoryPress = (category: any) => {
    console.log('Category pressed:', category.title);
  };

  const handleActionPress = (action: any) => {
    console.log('Action pressed:', action.title);
  };

  const handleRizzPress = (rizz: any) => {
    console.log('Rizz pressed:', rizz.title);
  };

  const handleAddRizz = () => {
    console.log('Add new rizz');
  };

  const handleSeeAllRizz = () => {
    router.push('/tabs/rizz');
  };

  const handleEventPress = (event: any) => {
    console.log('Event pressed:', event.title);
    showToast(`Added "${event.title}" to your calendar`, 'success');
  };

  const handleViewAllEvents = () => {
    console.log('View all events');
  };

  const handleUserProfilePress = () => {
    router.push('/home/profile');
  };

  const handleFilterPress = () => {
    setShowFilterSheet(true);
  };

  const handleApplyFilters = (
    status: 'all' | 'talking' | 'dating' | 'exclusive' | 'engaged',
    sort: 'newest' | 'oldest' | 'name_asc' | 'name_desc'
  ) => {
    setFilterStatus(status);
    setSortBy(sort);
    showToast('Filters applied', 'success');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.purple}
            colors={[Colors.purple]}
          />
        }
      >
        {/* Header */}
        <HomeHeader
          userName={userName}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleUserProfilePress}
        />

        {/* Search Bar with Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search date profiles..."
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Interest Tags */}
        <InterestTagsBar
          categories={getInterestCategories()}
          onCategoryPress={handleCategoryPress}
        />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Quick Actions */}
        <QuickActionsBar
          actions={getQuickActions()}
          onActionPress={handleActionPress}
        />

        {/* Favorites Shortcut */}
        <FavoritesCard />

        {/* Date Profiles Gallery */}
        {initialLoad && isLoading ? (
          <DateProfilesLoading />
        ) : (
          <DateProfilesGallery
            profiles={filteredProfiles}
            onNewProfile={handleNewDateProfile}
            onProfilePress={handleProfilePress}
          />
        )}

        {/* Today's Agenda */}
        <TodaysAgenda />

        {/* Quick Insights */}
        <QuickInsights />

        {/* Rizz Library */}
        <RizzLibrary
          rizzItems={getRizzLibrary()}
          onRizzPress={handleRizzPress}
          onAddRizz={handleAddRizz}
          onSeeAll={handleSeeAllRizz}
        />

        {/* Events Calendar */}
        <EventsCalendar
          events={getUpcomingEvents()}
          onEventPress={handleEventPress}
          onViewAll={handleViewAllEvents}
        />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date Profile Intro Modal */}
      <DateProfileIntroModal
        visible={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        onContinue={handleContinueToFlow}
      />

      {/* Filter Sheet */}
      <DateProfileFilterSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        currentStatus={filterStatus}
        currentSort={sortBy}
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
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterIcon: {
    fontSize: 20,
  },
});
