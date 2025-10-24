/**
 * My Favorites Collection Page
 * Displays all saved items across the app
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { Heart, Calendar, Location, Ticket } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { getFavorites, removeFavorite } from '@/utils/favoritesStorage';
import { FavoritesCollection } from '@/types/favorites';

export default function MyFavorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoritesCollection>({
    dateIdeas: [],
    events: [],
    hiddenGems: [],
    datePlans: [],
  });
  const [selectedTab, setSelectedTab] = useState<'all' | 'date_ideas' | 'events' | 'gems' | 'plans'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleTabPress = (tab: typeof selectedTab) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTab(tab);
  };

  const handleRemoveFavorite = async (id: string, type: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await removeFavorite(id, type);
    await loadFavorites();
  };

  const getTotalCount = () => {
    return (
      favorites.dateIdeas.length +
      favorites.events.length +
      favorites.hiddenGems.length +
      favorites.datePlans.length
    );
  };

  const getFilteredItems = () => {
    switch (selectedTab) {
      case 'date_ideas':
        return favorites.dateIdeas;
      case 'events':
        return favorites.events;
      case 'gems':
        return favorites.hiddenGems;
      case 'plans':
        return favorites.datePlans;
      default:
        return [
          ...favorites.dateIdeas,
          ...favorites.events,
          ...favorites.hiddenGems,
          ...favorites.datePlans,
        ];
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>{getTotalCount()} saved items</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => handleTabPress('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All ({getTotalCount()})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'date_ideas' && styles.tabActive]}
          onPress={() => handleTabPress('date_ideas')}
          activeOpacity={0.7}
        >
          <Heart size={16} color={selectedTab === 'date_ideas' ? Colors.textWhite : Colors.text} variant="Bold" />
          <Text style={[styles.tabText, selectedTab === 'date_ideas' && styles.tabTextActive]}>
            Date Ideas ({favorites.dateIdeas.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'events' && styles.tabActive]}
          onPress={() => handleTabPress('events')}
          activeOpacity={0.7}
        >
          <Ticket size={16} color={selectedTab === 'events' ? Colors.textWhite : Colors.text} variant="Bold" />
          <Text style={[styles.tabText, selectedTab === 'events' && styles.tabTextActive]}>
            Events ({favorites.events.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'gems' && styles.tabActive]}
          onPress={() => handleTabPress('gems')}
          activeOpacity={0.7}
        >
          <Location size={16} color={selectedTab === 'gems' ? Colors.textWhite : Colors.text} variant="Bold" />
          <Text style={[styles.tabText, selectedTab === 'gems' && styles.tabTextActive]}>
            Hidden Gems ({favorites.hiddenGems.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'plans' && styles.tabActive]}
          onPress={() => handleTabPress('plans')}
          activeOpacity={0.7}
        >
          <Calendar size={16} color={selectedTab === 'plans' ? Colors.textWhite : Colors.text} variant="Bold" />
          <Text style={[styles.tabText, selectedTab === 'plans' && styles.tabTextActive]}>
            Date Plans ({favorites.datePlans.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.purple}
          />
        }
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={`${item.type}-${item.id}`}
              style={styles.favoriteCard}
              activeOpacity={0.7}
            >
              <View style={styles.favoriteIcon}>
                <Text style={styles.favoriteEmoji}>{item.image || '✨'}</Text>
              </View>
              <View style={styles.favoriteContent}>
                <View style={styles.favoriteHeader}>
                  <Text style={styles.favoriteTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(item.id, item.type)}
                    activeOpacity={0.7}
                  >
                    <Heart size={20} color={Colors.primary} variant="Bold" />
                  </TouchableOpacity>
                </View>
                {item.description && (
                  <Text style={styles.favoriteDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <View style={styles.favoriteFooter}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>
                      {item.type.replace('_', ' ')}
                    </Text>
                  </View>
                  <Text style={styles.savedDate}>
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💝</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Start saving your favorite date ideas, events, and hidden gems!
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  tabsContainer: {
    maxHeight: 50,
    marginBottom: Spacing.md,
  },
  tabsContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  tabTextActive: {
    color: Colors.textWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  favoriteIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  favoriteEmoji: {
    fontSize: 30,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  favoriteTitle: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  favoriteDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  favoriteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    backgroundColor: `${Colors.purple}15`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
    textTransform: 'capitalize',
  },
  savedDate: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
