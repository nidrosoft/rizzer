/**
 * Gifts & Ideas Category Detail Screen - REFACTORED & INTEGRATED
 * Modular architecture with database integration
 * 
 * Components:
 * - GiftIdeaCard: Individual gift idea display
 * - GiftHistoryCard: Individual gift history display
 * - AIGiftSuggestionsModal: AI suggestions modal
 * - AddGiftIdeaModal: Add new gift idea form
 * - EmptyState: Empty state display
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Alert, Linking, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { MagicStar } from 'iconsax-react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';

// Components
import PlusButton from '@/components/ui/PlusButton';
import ErrorModal from '@/components/ui/ErrorModal';
import GiftIdeaCard from '@/components/gifts-ideas/GiftIdeaCard';
import GiftHistoryCard from '@/components/gifts-ideas/GiftHistoryCard';
import AIGiftSuggestionsModal from '@/components/gifts-ideas/AIGiftSuggestionsModal';
import AddGiftIdeaModal from '@/components/gifts-ideas/AddGiftIdeaModal';
import EmptyState from '@/components/gifts-ideas/EmptyState';
import DeleteGiftModal from '@/components/gifts-ideas/DeleteGiftModal';

// Backend functions
import {
  getActiveAIGiftSuggestions,
  getGiftIdeas,
  getGiftHistory,
  createGiftIdea,
  deleteGiftIdea,
  deleteGiftHistory,
  saveAIGiftSuggestionToIdeas,
} from '@/lib/dateProfileGifts';

// Types
import {
  ActiveAISuggestion,
  GiftIdea,
  GiftHistory as GiftHistoryType,
  GiftIdeaPriority,
} from '@/types/dateProfileGifts';

export default function GiftsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  
  const profileId = id as string;

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'history' | 'ideas'>('ideas');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; type: 'idea' | 'history' } | null>(null);

  // Data State
  const [aiSuggestions, setAISuggestions] = useState<ActiveAISuggestion[]>([]);
  const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
  const [giftHistory, setGiftHistory] = useState<GiftHistoryType[]>([]);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load all data
  const loadData = useCallback(async () => {
    if (!profileId) return;

    try {
      console.log('🎁 Loading gifts data for profile:', profileId);
      setIsLoading(true);
      setError(null);

      const [aiResult, ideasResult, historyResult] = await Promise.all([
        getActiveAIGiftSuggestions(profileId),
        getGiftIdeas(profileId),
        getGiftHistory(profileId),
      ]);

      if (!aiResult.success) throw new Error(aiResult.error);
      if (!ideasResult.success) throw new Error(ideasResult.error);
      if (!historyResult.success) throw new Error(historyResult.error);

      setAISuggestions(aiResult.data || []);
      setGiftIdeas(ideasResult.data || []);
      setGiftHistory(historyResult.data || []);

      console.log('✅ Gifts data loaded successfully');
    } catch (err: any) {
      console.error('❌ Error loading gifts data:', err);
      setError(err.message || 'Failed to load gifts data');
      
      if (err.message?.includes('Network') || err.message?.includes('network')) {
        setShowErrorModal(true);
      } else {
        showToast(err.message || 'Failed to load gifts data', 'error');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [profileId, showToast]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleAdd = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowAddModal(true);
  };

  const handleAISuggestions = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowAIModal(true);
  };

  const handleSaveIdea = async (data: {
    title: string;
    occasion: string;
    budget: string;
    notes: string;
    priority: GiftIdeaPriority;
  }) => {
    if (!data.title.trim()) {
      showToast('Please enter a gift title', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const result = await createGiftIdea({
        date_profile_id: profileId,
        title: data.title.trim(),
        occasion: data.occasion.trim() || undefined,
        budget: data.budget.trim() || undefined,
        notes: data.notes.trim() || undefined,
        priority: data.priority,
      });

      if (!result.success) throw new Error(result.error);

      showToast('Gift idea added!', 'success');
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add gift idea', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteIdea = (ideaId: string, title: string) => {
    setDeleteTarget({ id: ideaId, title, type: 'idea' });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setShowDeleteModal(false);

    if (deleteTarget.type === 'idea') {
      const result = await deleteGiftIdea(deleteTarget.id);
      if (result.success) {
        showToast('Gift idea deleted', 'success');
        loadData();
      } else {
        showToast(result.error || 'Failed to delete', 'error');
      }
    } else {
      const result = await deleteGiftHistory(deleteTarget.id);
      if (result.success) {
        showToast('Gift history deleted', 'success');
        loadData();
      } else {
        showToast(result.error || 'Failed to delete', 'error');
      }
    }

    setDeleteTarget(null);
  };

  const handleDeleteHistory = (historyId: string, title: string) => {
    setDeleteTarget({ id: historyId, title, type: 'history' });
    setShowDeleteModal(true);
  };

  const handleSaveSuggestionToIdeas = async (suggestion: ActiveAISuggestion) => {
    const result = await saveAIGiftSuggestionToIdeas(suggestion.id, {
      priority: 'High',
    });

    if (result.success) {
      showToast('Added to your gift ideas!', 'success');
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setShowAIModal(false);
      loadData();
    } else {
      showToast(result.error || 'Failed to save', 'error');
    }
  };

  const handleOpenProductLink = async (url: string | null) => {
    if (!url) {
      showToast('No product link available', 'error');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast('Cannot open this link', 'error');
      }
    } catch (err) {
      showToast('Failed to open link', 'error');
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      setIsGenerating(true);
      console.log('🤖 Generating AI gift suggestions for profile:', profileId);

      // Call the Edge Function to generate suggestions
      const response = await fetch(
        'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/generate-gift-suggestions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2c3B3anVudWtwaHFkampmdmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTA2MzQsImV4cCI6MjA3Njg2NjYzNH0.RhhUP8x12SC-hJy6GsLNGOQPL2uvV1DpPrykZZQrFhQ',
          },
          body: JSON.stringify({ profileId }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate suggestions');
      }

      console.log('✅ AI suggestions generated successfully:', result);
      showToast(`Generated ${result.suggestionsCount} suggestions!`, 'success');
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Reload data to show new suggestions
      await loadData();
    } catch (err: any) {
      console.error('❌ Error generating suggestions:', err);
      showToast(err.message || 'Failed to generate suggestions', 'error');
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.6}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gifts & Ideas</Text>
          <View style={styles.navButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.purple} />
          <Text style={styles.loadingText}>Loading gifts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.6}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
            <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gifts & Ideas</Text>
        <View style={styles.navButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.purple]}
            tintColor={Colors.purple}
          />
        }
      >
        {/* AI Suggestions Banner - Always Visible */}
        <TouchableOpacity style={styles.aiBanner} onPress={handleAISuggestions} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.aiBannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.aiBannerContent}>
              <View style={styles.aiBannerLeft}>
                <MagicStar size={24} color={Colors.textWhite} variant="Bold" />
                <View>
                  <Text style={styles.aiBannerTitle}>AI Gift Suggestions</Text>
                  <Text style={styles.aiBannerSubtitle}>
                    {aiSuggestions.length > 0 
                      ? `${aiSuggestions.length} personalized idea${aiSuggestions.length !== 1 ? 's' : ''}`
                      : 'No suggestions yet'}
                  </Text>
                </View>
              </View>
              <Text style={styles.aiBannerArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'ideas' && styles.tabActive]}
            onPress={() => setSelectedTab('ideas')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, selectedTab === 'ideas' && styles.tabTextActive]}>
              Future Ideas ({giftIdeas.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'history' && styles.tabActive]}
            onPress={() => setSelectedTab('history')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, selectedTab === 'history' && styles.tabTextActive]}>
              Gift History ({giftHistory.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Future Ideas Tab */}
        {selectedTab === 'ideas' && (
          <View style={styles.tabContent}>
            {giftIdeas.length === 0 ? (
              <EmptyState
                icon="💡"
                title="No Gift Ideas Yet"
                message="Tap the + button to add your first gift idea"
              />
            ) : (
              giftIdeas.map((idea) => (
                <GiftIdeaCard
                  key={idea.id}
                  idea={idea}
                  onDelete={handleDeleteIdea}
                />
              ))
            )}
          </View>
        )}

        {/* Gift History Tab */}
        {selectedTab === 'history' && (
          <View style={styles.tabContent}>
            {giftHistory.length === 0 ? (
              <EmptyState
                icon="🎁"
                title="No Gift History Yet"
                message="Your gift history will appear here"
              />
            ) : (
              giftHistory.map((gift) => (
                <GiftHistoryCard
                  key={gift.id}
                  gift={gift}
                  onDelete={handleDeleteHistory}
                />
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* AI Suggestions Modal */}
      <AIGiftSuggestionsModal
        visible={showAIModal}
        suggestions={aiSuggestions}
        onClose={() => setShowAIModal(false)}
        onSaveToIdeas={handleSaveSuggestionToIdeas}
        onOpenLink={handleOpenProductLink}
        onGenerate={handleGenerateSuggestions}
        isGenerating={isGenerating}
      />

      {/* Add Gift Modal */}
      <AddGiftIdeaModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveIdea}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteGiftModal
          visible={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleConfirmDelete}
          title={deleteTarget.title}
          type={deleteTarget.type}
        />
      )}

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onRetry={loadData}
        title="Connection Issue"
        message="Unable to load gifts data. Please check your internet connection and try again."
        showRetry={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: '#FAFAFA',
  },
  navButton: {
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
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  aiBanner: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  aiBannerGradient: { padding: Spacing.lg },
  aiBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiBannerTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  aiBannerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textWhite,
    opacity: 0.9,
  },
  aiBannerArrow: { fontSize: 24, color: Colors.textWhite },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: { backgroundColor: Colors.purple },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
  tabTextActive: { color: Colors.textWhite },
  tabContent: { gap: Spacing.md },
});
