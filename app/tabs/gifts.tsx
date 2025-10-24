/**
 * Gifts Tab Screen
 * Main screen for the Gifts feature with Active/Completed tabs
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter } from 'expo-router';
import { Gift, SearchNormal1, Filter, Sort } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights, FontSizes, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { GiftsTab, Investigation, InvestigationStatus } from '@/types/gifts';
import { mockInvestigations, getActiveInvestigations, getCompletedInvestigations } from '@/data/mockGifts';

// Shared UI Components
import TabSwitch from '@/components/ui/TabSwitch';
import EmptyState from '@/components/ui/EmptyState';
import PlusButton from '@/components/ui/PlusButton';
import SearchBar from '@/components/ui/SearchBar';

// Gifts-specific Components
import InvestigationList from '@/components/gifts/InvestigationList';
import StartGiftModal from '@/components/gifts/StartGiftModal';

type SortOption = 'recent' | 'upcoming' | 'name';
type FilterOption = 'all' | 'active' | 'paused' | 'pending';

export default function GiftsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GiftsTab>('active');
  const [investigations] = useState(mockInvestigations);
  const [showStartModal, setShowStartModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort investigations
  const filteredInvestigations = useMemo(() => {
    let result = activeTab === 'active' 
      ? getActiveInvestigations(investigations)
      : getCompletedInvestigations(investigations);

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(inv => 
        inv.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.occasion.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter (only for active tab)
    if (activeTab === 'active' && filterBy !== 'all') {
      result = result.filter(inv => inv.status === filterBy);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'upcoming':
          // Sort by last message time (most recent activity first)
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        case 'name':
          return a.recipientName.localeCompare(b.recipientName);
        default:
          return 0;
      }
    });

    return result;
  }, [investigations, activeTab, searchQuery, sortBy, filterBy]);

  const currentInvestigations = filteredInvestigations;

  // Handlers
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as GiftsTab);
  };

  const handlePlusPress = () => {
    setShowStartModal(true);
  };

  const handleStartInvestigation = () => {
    setShowStartModal(false);
    router.push('/gifts/steps/step1-contact');
  };

  const handleCloseModal = () => {
    setShowStartModal(false);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleInvestigationPress = (id: string) => {
    // Find the investigation to get details
    const investigation = investigations.find(inv => inv.id === id);
    if (!investigation) return;

    // Navigate to investigation detail screen
    router.push({
      pathname: '/gifts/investigation-detail',
      params: {
        investigationId: id,
        recipientName: investigation.recipientName,
        status: investigation.status,
      },
    });
  };

  // Tab configuration
  const tabs = [
    { key: 'active', label: GiftsConfig.tabs.active },
    { key: 'completed', label: GiftsConfig.tabs.completed },
  ];

  // Empty state configuration
  const emptyStateConfig = activeTab === 'active' 
    ? GiftsConfig.emptyStates.active 
    : GiftsConfig.emptyStates.completed;

  return (
    <View style={styles.container}>
      {/* Header + Tabs with Gradient (extends to status bar) */}
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gifts 🎁</Text>
          </View>
          <TabSwitch 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            variant="light"
          />
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder="Search by name or occasion..."
            />
          </View>

          {/* Filter & Sort Controls */}
          <View style={styles.controlsContainer}>
            {/* Filter Button */}
            {activeTab === 'active' && (
              <TouchableOpacity
                style={[styles.controlButton, filterBy !== 'all' && styles.controlButtonActive]}
                onPress={toggleFilters}
                activeOpacity={0.7}
              >
                <Filter size={18} color={Colors.textWhite} variant="Bold" />
                <Text style={styles.controlButtonText}>Filter</Text>
                {filterBy !== 'all' && <View style={styles.activeDot} />}
              </TouchableOpacity>
            )}

            {/* Sort Dropdown */}
            <View style={styles.sortContainer}>
              <Sort size={18} color={Colors.textWhite} variant="Bold" />
              <Text style={styles.sortLabel}>Sort:</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'recent' && styles.sortOptionActive]}
                  onPress={() => setSortBy('recent')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sortOptionText, sortBy === 'recent' && styles.sortOptionTextActive]}>
                    Recent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'upcoming' && styles.sortOptionActive]}
                  onPress={() => setSortBy('upcoming')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sortOptionText, sortBy === 'upcoming' && styles.sortOptionTextActive]}>
                    Upcoming
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'name' && styles.sortOptionActive]}
                  onPress={() => setSortBy('name')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sortOptionText, sortBy === 'name' && styles.sortOptionTextActive]}>
                    Name
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Filter Options (Expandable) */}
          {showFilters && activeTab === 'active' && (
            <View style={styles.filterOptionsContainer}>
              <TouchableOpacity
                style={[styles.filterOption, filterBy === 'all' && styles.filterOptionActive]}
                onPress={() => setFilterBy('all')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterOptionText, filterBy === 'all' && styles.filterOptionTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, filterBy === 'active' && styles.filterOptionActive]}
                onPress={() => setFilterBy('active')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterOptionText, filterBy === 'active' && styles.filterOptionTextActive]}>
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, filterBy === 'paused' && styles.filterOptionActive]}
                onPress={() => setFilterBy('paused')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterOptionText, filterBy === 'paused' && styles.filterOptionTextActive]}>
                  Paused
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, filterBy === 'pending' && styles.filterOptionActive]}
                onPress={() => setFilterBy('pending')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterOptionText, filterBy === 'pending' && styles.filterOptionTextActive]}>
                  Pending
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>

      {/* Content */}
      {currentInvestigations.length === 0 ? (
        <EmptyState
          icon={<Gift size={32} color={Colors.textSecondary} variant="Outline" />}
          title={emptyStateConfig.title}
          description={emptyStateConfig.description}
          actionLabel={activeTab === 'active' ? emptyStateConfig.actionLabel : undefined}
          onAction={activeTab === 'active' ? handlePlusPress : undefined}
        />
      ) : (
        <InvestigationList
          investigations={currentInvestigations}
          onInvestigationPress={handleInvestigationPress}
        />
      )}

      {/* Plus Button */}
      <PlusButton onPress={handlePlusPress} />

      {/* Start Gift Modal */}
      <StartGiftModal
        visible={showStartModal}
        onClose={handleCloseModal}
        onStart={handleStartInvestigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradientHeader: {
    // No additional styles needed, gradient handles it
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.full,
    position: 'relative',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textWhite,
    position: 'absolute',
    top: 4,
    right: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textWhite,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sortOption: {
    paddingVertical: Spacing.xs - 2,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.sm,
  },
  sortOptionActive: {
    backgroundColor: Colors.textWhite,
  },
  sortOptionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  sortOptionTextActive: {
    color: Colors.gradientStart,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  filterOption: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterOptionActive: {
    backgroundColor: Colors.textWhite,
    borderColor: Colors.textWhite,
  },
  filterOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  filterOptionTextActive: {
    color: Colors.gradientStart,
  },
});
