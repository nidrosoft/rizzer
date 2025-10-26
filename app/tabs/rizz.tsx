/**
 * Rizz Screen - Refactored with Modular Architecture
 * My Rizz categories and Rizz Coach chat threads
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { RizzTab } from '@/types/rizz';
import { useAuthStore } from '@/store/authStore';

// Modular Components
import RizzHeader from '@/components/rizz/RizzHeader';
import RizzTabs from '@/components/rizz/RizzTabs';
import RizzCategoriesGrid from '@/components/rizz/RizzCategoriesGrid';
import ChatThreadList from '@/components/rizz/ChatThreadList';
import PlusButton from '@/components/ui/PlusButton';
import CreateRizzIntroModal from '@/components/rizz/CreateRizzIntroModal';
import CreateRizzBottomSheet, { RizzCategoryData } from '@/components/rizz/CreateRizzBottomSheet';
import CategoryManageSheet from '@/components/rizz/CategoryManageSheet';
import DeleteCategoryModal from '@/components/rizz/DeleteCategoryModal';
import ErrorModal from '@/components/ui/ErrorModal';
import { useToast } from '@/contexts/ToastContext';

// Backend Functions
import { getRizzCategories as fetchRizzCategories, createRizzCategory, deleteRizzCategory } from '@/lib/rizzCategories';
import { getChatThreads as fetchChatThreads } from '@/lib/geniusChat';
import { groupChatsByDate } from '@/data/mockRizz';

export default function RizzScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  
  // UI State
  const [activeTab, setActiveTab] = useState<RizzTab>('myRizz');
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showManageSheet, setShowManageSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; title: string } | null>(null);
  
  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [chatThreads, setChatThreads] = useState<any[]>([]);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data from database
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔥 Loading Rizz data...');
      setIsLoading(true);
      setError(null);
      
      if (activeTab === 'myRizz') {
        // Load categories
        const result = await fetchRizzCategories(user.id);
        if (result.success && result.data) {
          setCategories(result.data);
          console.log('✅ Loaded categories:', result.data.length);
        } else {
          throw new Error(result.error || 'Failed to load categories');
        }
      } else {
        // Load chat threads
        const result = await fetchChatThreads(user.id);
        if (result.success && result.data) {
          setChatThreads(result.data);
          console.log('✅ Loaded chat threads:', result.data.length);
        } else {
          throw new Error(result.error || 'Failed to load chat threads');
        }
      }
    } catch (err: any) {
      console.error('❌ Error loading Rizz data:', err);
      setError(err.message);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, activeTab]);
  
  // Load data on mount and tab change
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };
  
  // Handlers
  const handleTabChange = (tab: RizzTab) => {
    setActiveTab(tab);
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/rizz/category-detail?id=${categoryId}`);
  };

  const handleCategoryLongPress = (categoryId: number, categoryTitle: string) => {
    setSelectedCategory({ id: categoryId, title: categoryTitle });
    setShowManageSheet(true);
  };

  const handleDeletePress = () => {
    setShowManageSheet(false);
    // Show confirmation modal after a brief delay
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      console.log('🗑️ Deleting category:', selectedCategory.id);
      
      const result = await deleteRizzCategory(selectedCategory.id);
      
      if (result.success) {
        showToast(`"${selectedCategory.title}" deleted`, 'success');
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Reload categories to reflect deletion
        await loadData();
        setSelectedCategory(null);
      } else {
        throw new Error(result.error || 'Failed to delete category');
      }
    } catch (err: any) {
      console.error('❌ Error deleting category:', err);
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveCategory = () => {
    setShowManageSheet(false);
    // TODO: Implement archive category logic
    if (selectedCategory) {
      showToast(`"${selectedCategory.title}" archived`, 'success');
      // Reload categories after archiving
      setTimeout(() => loadData(), 500);
    }
  };

  const handleChatPress = (chatId: string) => {
    router.push(`/genius-chat?id=${chatId}`);
  };

  const handleAddRizz = async () => {
    // Navigate to genius chat if on Rizz Coach tab
    if (activeTab === 'geniusRizz') {
      if (!user?.id) return;
      
      // Create a new conversation first
      const { createChatThread } = await import('@/lib/geniusChat');
      const result = await createChatThread({ user_id: user.id });
      
      if (result.success && result.data) {
        // Reload chat threads to show new conversation
        await loadData();
        // Navigate with the conversation ID
        router.push(`/genius-chat?id=${result.data.id}`);
      } else {
        console.error('Failed to create conversation:', result.error);
      }
    } else {
      // Show intro modal for creating custom Rizz
      setShowIntroModal(true);
    }
  };

  const handleContinueToCreate = () => {
    setShowIntroModal(false);
    // Small delay for smooth transition
    setTimeout(() => {
      setShowCreateSheet(true);
    }, 300);
  };

  const handleCreateRizz = async (data: RizzCategoryData) => {
    if (!user?.id) return;
    
    try {
      setIsCreating(true);
      
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      console.log('🔥 Creating custom Rizz category:', data);
      
      const result = await createRizzCategory({
        user_id: user.id,
        title: data.name,
        description: data.description,
        emoji: data.emoji,
        color: data.color,
      });
      
      if (result.success) {
        setShowCreateSheet(false);
        showToast(`"${data.name}" created successfully!`, 'success');
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Reload categories
        await loadData();
      } else {
        throw new Error(result.error || 'Failed to create category');
      }
    } catch (err: any) {
      console.error('❌ Error creating category:', err);
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const chatGroups = groupChatsByDate(chatThreads);

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
          <RizzHeader title="Rizz ⚡" />
          <RizzTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </SafeAreaView>
      </LinearGradient>

      {/* Content */}
      {isLoading || isDeleting ? (
        // Loading State
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.purple} />
          <Text style={styles.loadingText}>{isDeleting ? 'Deleting...' : 'Loading...'}</Text>
        </View>
      ) : activeTab === 'myRizz' ? (
        // My Rizz - Categories Grid
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.purple}
            />
          }
        >
          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Categories Yet</Text>
              <Text style={styles.emptyMessage}>Tap the + button to create your first custom Rizz category!</Text>
            </View>
          ) : (
            <RizzCategoriesGrid
              categories={categories}
              onCategoryPress={handleCategoryPress}
              onCategoryLongPress={handleCategoryLongPress}
            />
          )}
        </ScrollView>
      ) : (
        // Rizz Coach - Chat Threads
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.purple}
            />
          }
        >
          {chatThreads.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Conversations Yet</Text>
              <Text style={styles.emptyMessage}>Tap the + button to start chatting with your dating coach!</Text>
            </View>
          ) : (
            <ChatThreadList
              chatGroups={chatGroups}
              onChatPress={handleChatPress}
            />
          )}
        </ScrollView>
      )}

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAddRizz} />

      {/* Create Rizz Modals */}
      <CreateRizzIntroModal
        visible={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        onContinue={handleContinueToCreate}
      />
      
      <CreateRizzBottomSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onCreate={handleCreateRizz}
        isCreating={isCreating}
      />

      {/* Category Manage Sheet */}
      <CategoryManageSheet
        visible={showManageSheet}
        onClose={() => setShowManageSheet(false)}
        onDelete={handleConfirmDelete}
        onDeletePress={handleDeletePress}
        onArchive={handleArchiveCategory}
        categoryTitle={selectedCategory?.title}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        categoryTitle={selectedCategory?.title}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onRetry={() => {
          setShowErrorModal(false);
          loadData();
        }}
        title="Connection Issue"
        message={error || 'Unable to load your rizz. Please check your internet connection and try again.'}
        showRetry={true}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: 100,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl * 3,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
