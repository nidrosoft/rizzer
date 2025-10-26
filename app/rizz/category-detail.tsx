/**
 * Rizz Category Detail Screen - Refactored
 * Clean orchestration of category detail components
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Clipboard, Platform, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/contexts/ToastContext';
import {
  CategoryHeader,
  RizzList,
  RegenerateFAB,
  CategoryActionSheet,
  DeleteModal,
} from '@/components/rizz/category-detail';
import { getRizzCategory, getRizzLines, updateRizzLine, deleteRizzCategory } from '@/lib/rizzCategories';
import { generateRizzLines } from '@/lib/rizzGeneration';
import type { RizzCategory, RizzLine } from '@/lib/rizzCategories';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  
  // UI State
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Data State
  const [category, setCategory] = useState<RizzCategory | null>(null);
  const [rizzLines, setRizzLines] = useState<RizzLine[]>([]);
  const [savedRizzIds, setSavedRizzIds] = useState<Set<string>>(new Set());
  
  const categoryId = params.id ? parseInt(params.id as string) : null;

  // Load category and rizz lines
  const loadData = useCallback(async () => {
    if (!categoryId || !user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Load category details
      const categoryResult = await getRizzCategory(categoryId, user.id);
      if (categoryResult.success && categoryResult.data) {
        setCategory(categoryResult.data);
      }
      
      // Load existing rizz lines
      const linesResult = await getRizzLines(categoryId, user.id);
      if (linesResult.success && linesResult.data) {
        setRizzLines(linesResult.data);
        
        // Track saved lines
        const saved = new Set<string>();
        linesResult.data.forEach(line => {
          if (line.is_saved) saved.add(line.id);
        });
        setSavedRizzIds(saved);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load category', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, user?.id]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleBack = () => {
    router.back();
  };

  const handleCopy = async (text: string, lineId: string) => {
    Clipboard.setString(text);
    showToast('Copied to clipboard!', 'info');
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Update times_copied in database
    if (user?.id) {
      const line = rizzLines.find(l => l.id === lineId);
      if (line) {
        await updateRizzLine(lineId, {
          times_copied: line.times_copied + 1,
        });
      }
    }
  };

  const handleSave = async (lineId: string) => {
    if (!user?.id) return;
    
    const isSaved = savedRizzIds.has(lineId);
    const newSavedIds = new Set(savedRizzIds);
    
    if (isSaved) {
      newSavedIds.delete(lineId);
      showToast('Removed from collection!', 'success');
    } else {
      newSavedIds.add(lineId);
      showToast('Saved to collection!', 'success');
    }
    
    setSavedRizzIds(newSavedIds);
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Update in database
    await updateRizzLine(lineId, {
      is_saved: !isSaved,
      saved_at: !isSaved ? new Date().toISOString() : null,
    });
    
    // Update local state
    setRizzLines(prev => prev.map(line => 
      line.id === lineId 
        ? { ...line, is_saved: !isSaved, saved_at: !isSaved ? new Date().toISOString() : null }
        : line
    ));
  };

  const handleRegenerate = async () => {
    if (!categoryId || !user?.id || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      console.log('🎯 Generating rizz lines...');
      
      // Call AI generation
      const result = await generateRizzLines(categoryId, user.id);
      
      if (result.success && result.data) {
        console.log(`✅ Generated ${result.data.length} new lines`);
        
        // Add new lines to the list (prepend so they appear at top)
        setRizzLines(prev => [...result.data!, ...prev]);
        
        showToast(`Generated ${result.data.length} new rizz lines!`, 'success');
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        throw new Error(result.error || 'Failed to generate rizz lines');
      }
    } catch (error: any) {
      console.error('❌ Error generating rizz lines:', error);
      showToast(error.message || 'Failed to generate rizz lines', 'error');
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMoreOptions = () => {
    setShowActionSheet(true);
  };

  const handleAddToHome = () => {
    setShowActionSheet(false);
    // TODO: Add to home quick actions
    showToast('Added to Home Quick Actions!', 'success');
  };

  const handleDeletePress = () => {
    setShowActionSheet(false);
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!categoryId) return;
    
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      const result = await deleteRizzCategory(categoryId);
      
      if (result.success) {
        showToast('Category deleted successfully', 'success');
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        setTimeout(() => {
          router.back();
        }, 500);
      } else {
        throw new Error(result.error || 'Failed to delete category');
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      showToast(error.message || 'Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E6E9EB', '#FFFFFF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.purple} />
            <Text style={styles.loadingText}>Loading category...</Text>
          </View>
        ) : !category ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Category not found</Text>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CategoryHeader
              title={category.title}
              description={category.description || ''}
              onBack={handleBack}
              onMoreOptions={handleMoreOptions}
            />

            <RizzList
              rizzes={rizzLines.map(line => line.content)}
              rizzLines={rizzLines}
              savedRizzIds={savedRizzIds}
              isGenerating={isGenerating}
              onSave={handleSave}
              onCopy={handleCopy}
            />

            <RegenerateFAB 
              onPress={handleRegenerate} 
              isGenerating={isGenerating}
              hasExistingLines={rizzLines.length > 0}
            />

            <CategoryActionSheet
              visible={showActionSheet}
              onClose={() => setShowActionSheet(false)}
              onAddToHome={handleAddToHome}
              onDelete={handleDeletePress}
            />

            <DeleteModal
              visible={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={handleConfirmDelete}
            />
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.full,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
});
