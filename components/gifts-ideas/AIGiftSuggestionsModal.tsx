/**
 * AI Gift Suggestions Modal Component
 * Displays AI-generated gift suggestions with actions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { MagicStar, Link, Heart, CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { ActiveAISuggestion } from '@/types/dateProfileGifts';

interface AIGiftSuggestionsModalProps {
  visible: boolean;
  suggestions: ActiveAISuggestion[];
  onClose: () => void;
  onSaveToIdeas: (suggestion: ActiveAISuggestion) => void;
  onOpenLink: (url: string | null) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
}

export default function AIGiftSuggestionsModal({
  visible,
  suggestions,
  onClose,
  onSaveToIdeas,
  onOpenLink,
  onGenerate,
  isGenerating,
}: AIGiftSuggestionsModalProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [nextBatchTime, setNextBatchTime] = useState(0);

  const loadingSteps = [
    '🔍 Analyzing profile data...',
    '💭 Understanding preferences...',
    '🎯 Finding perfect matches...',
    '🎁 Curating gift ideas...',
    '✨ Almost there...',
  ];

  // Animate loading steps
  useEffect(() => {
    if (isGenerating) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2000); // Change every 2 seconds for more realistic feel

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Countdown timer for next batch (24 hours from last generation)
  useEffect(() => {
    if (suggestions.length > 0 && !isGenerating) {
      // Calculate time until next batch (24 hours from first suggestion)
      const firstSuggestion = suggestions[0];
      if (firstSuggestion.generated_at) {
        const generatedTime = new Date(firstSuggestion.generated_at).getTime();
        const nextBatchTime = generatedTime + (24 * 60 * 60 * 1000); // 24 hours
        
        const updateTimer = () => {
          const now = Date.now();
          const timeLeft = Math.max(0, nextBatchTime - now);
          setNextBatchTime(Math.floor(timeLeft / 1000)); // Convert to seconds
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [suggestions, isGenerating]);

  // Format countdown time
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleSave = (suggestion: ActiveAISuggestion) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSaveToIdeas(suggestion);
  };

  const handleOpenLink = (url: string | null) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onOpenLink(url);
  };

  const handleGenerate = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await onGenerate();
  };

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.handle} />
          
          {/* Close X Button */}
          <TouchableOpacity style={styles.closeXButton} onPress={handleClose} activeOpacity={0.7}>
            <CloseCircle size={28} color={Colors.textSecondary} variant="Bold" />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <MagicStar size={28} color={Colors.purple} variant="Bold" />
            <Text style={styles.title}>AI Gift Suggestions</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Based on their interests, conversations, and preferences
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* Next batch countdown */}
            {suggestions.length > 0 && nextBatchTime > 0 && (
              <View style={styles.countdownBanner}>
                <Text style={styles.countdownText}>
                  ⏰ Next batch in {formatCountdown(nextBatchTime)}
                </Text>
              </View>
            )}

            {suggestions.length === 0 ? (
              <View style={styles.emptyState}>
                <MagicStar size={64} color={Colors.purple} variant="Bulk" />
                <Text style={styles.emptyTitle}>No Suggestions Yet</Text>
                <Text style={styles.emptyText}>
                  Tap the button below to generate personalized gift suggestions
                </Text>
              </View>
            ) : (
              suggestions.map((suggestion) => (
              <View key={suggestion.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{suggestion.title}</Text>
                  {suggestion.confidence_score && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{suggestion.confidence_score}% match</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.reason}>💡 {suggestion.reason}</Text>
                
                <View style={styles.details}>
                  {suggestion.price && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Price:</Text>
                      <Text style={styles.detailValue}>{suggestion.price}</Text>
                    </View>
                  )}
                  {suggestion.occasion && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>For:</Text>
                      <Text style={styles.detailValue}>{suggestion.occasion}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenLink(suggestion.product_link)}
                    activeOpacity={0.7}
                  >
                    <Link size={18} color={Colors.purple} variant="Outline" />
                    <Text style={styles.actionText}>View Product</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSave(suggestion)}
                    activeOpacity={0.7}
                  >
                    <Heart 
                      size={18} 
                      color={Colors.purple} 
                      variant={suggestion.status === 'saved' ? 'Bold' : 'Outline'} 
                    />
                    <Text style={styles.actionText}>
                      {suggestion.status === 'saved' ? 'Saved' : 'Save Idea'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
            )}
          </ScrollView>

          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]} 
            onPress={handleGenerate} 
            activeOpacity={0.8}
            disabled={isGenerating}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.generateButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color={Colors.textWhite} size="small" />
                  <Text style={styles.generateButtonText}>{loadingSteps[loadingStep]}</Text>
                </>
              ) : (
                <>
                  <MagicStar size={20} color={Colors.textWhite} variant="Bold" />
                  <Text style={styles.generateButtonText}>Show Me Perfect Gifts</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  countdownBanner: {
    backgroundColor: '#FFF9E6',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  countdownText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: '#8B6914',
    textAlign: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
  },
  badge: {
    backgroundColor: '#000000',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: '#FFFFFF',
  },
  reason: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 4,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.purple,
  },
  closeXButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.xl,
    zIndex: 10,
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  generateButton: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 2,
  },
  generateButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
