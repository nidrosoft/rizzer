/**
 * Gifts & Ideas Category Detail Screen
 * AI-powered gift suggestions and gift history
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Gift, MagicStar, ShoppingCart, Heart, Link as LinkIcon, More } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function GiftsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'history' | 'ideas'>('ideas');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
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

  const handleMenu = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleDelete = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowDeleteModal(true), 300);
  };

  const handleArchive = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowArchiveModal(true), 300);
  };

  const confirmDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDeleteModal(false);
    setTimeout(() => router.back(), 500);
  };

  const confirmArchive = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowArchiveModal(false);
    setTimeout(() => router.back(), 500);
  };

  // Mock AI suggestions
  const aiSuggestions = [
    {
      id: '1',
      title: 'Professional Hair Styling Kit',
      reason: 'Based on her profession as a hair braider',
      price: '$89.99',
      occasion: 'Birthday',
      confidence: 95,
      link: 'https://example.com',
    },
    {
      id: '2',
      title: 'Yoga Mat & Accessories Set',
      reason: 'She mentioned wanting to try yoga',
      price: '$54.99',
      occasion: 'Just Because',
      confidence: 88,
      link: 'https://example.com',
    },
    {
      id: '3',
      title: 'Sunflower Bouquet Subscription',
      reason: 'Her favorite flower is sunflowers',
      price: '$39.99/month',
      occasion: 'Anniversary',
      confidence: 92,
      link: 'https://example.com',
    },
    {
      id: '4',
      title: 'Italian Cooking Class for Two',
      reason: 'Loves Italian food & cooking together',
      price: '$120.00',
      occasion: 'Date Idea',
      confidence: 85,
      link: 'https://example.com',
    },
  ];

  // Mock gift history
  const giftHistory = [
    {
      id: '1',
      title: 'Lavender Scented Candles',
      date: 'October 10, 2024',
      occasion: 'Just Because',
      status: 'Given',
      price: '$24.99',
      reaction: '❤️ Loved it!',
    },
    {
      id: '2',
      title: 'Photography Book',
      date: 'September 15, 2024',
      occasion: 'Birthday',
      status: 'Given',
      price: '$45.00',
      reaction: '😊 Really appreciated',
    },
  ];

  // Future gift ideas
  const futureIdeas = [
    {
      id: '1',
      title: 'Weekend Trip to Napa Valley',
      occasion: 'Anniversary',
      budget: '$500-800',
      notes: 'She mentioned wanting to visit wine country',
      priority: 'High',
    },
    {
      id: '2',
      title: 'Custom Name Necklace',
      occasion: 'Christmas',
      budget: '$80-120',
      notes: 'Saw her looking at jewelry online',
      priority: 'Medium',
    },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      'High': '#FF6B9D',
      'Medium': '#F59E0B',
      'Low': '#10B981',
    };
    return colors[priority] || Colors.purple;
  };

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
        <TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
          <More size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Suggestions Banner */}
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
                  <Text style={styles.aiBannerSubtitle}>{aiSuggestions.length} personalized ideas</Text>
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
              Future Ideas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'history' && styles.tabActive]}
            onPress={() => setSelectedTab('history')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, selectedTab === 'history' && styles.tabTextActive]}>
              Gift History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Future Ideas Tab */}
        {selectedTab === 'ideas' && (
          <View style={styles.tabContent}>
            {futureIdeas.map((idea) => (
              <View key={idea.id} style={styles.ideaCard}>
                <View style={styles.ideaHeader}>
                  <Text style={styles.ideaTitle}>{idea.title}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(idea.priority)}15` }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(idea.priority) }]}>
                      {idea.priority}
                    </Text>
                  </View>
                </View>
                <View style={styles.ideaRow}>
                  <Text style={styles.ideaLabel}>Occasion:</Text>
                  <Text style={styles.ideaValue}>{idea.occasion}</Text>
                </View>
                <View style={styles.ideaRow}>
                  <Text style={styles.ideaLabel}>Budget:</Text>
                  <Text style={styles.ideaValue}>{idea.budget}</Text>
                </View>
                <Text style={styles.ideaNotes}>{idea.notes}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Gift History Tab */}
        {selectedTab === 'history' && (
          <View style={styles.tabContent}>
            {giftHistory.map((gift) => (
              <View key={gift.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Gift size={24} color={Colors.purple} variant="Bold" />
                  <View style={styles.historyHeaderText}>
                    <Text style={styles.historyTitle}>{gift.title}</Text>
                    <Text style={styles.historyDate}>{gift.date}</Text>
                  </View>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Occasion:</Text>
                    <Text style={styles.historyValue}>{gift.occasion}</Text>
                  </View>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Price:</Text>
                    <Text style={styles.historyValue}>{gift.price}</Text>
                  </View>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Status:</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{gift.status}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.reactionContainer}>
                  <Heart size={16} color="#FF6B9D" variant="Bold" />
                  <Text style={styles.reactionText}>{gift.reaction}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* Category Action Sheet */}
      <CategoryActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onArchive={handleArchive}
        onDelete={handleDelete}
        title="Manage Gifts"
        deleteModalVisible={showDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={confirmDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => setShowDeleteModal(false)}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage="This action cannot be undone. All gift ideas and history will be permanently removed."
        archiveMessage="Gifts will be moved to archives. You can restore them anytime."
      />

      {/* AI Suggestions Modal */}
      <Modal
        visible={showAIModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAIModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aiModal}>
            <View style={styles.modalHandle} />
            <View style={styles.aiModalHeader}>
              <MagicStar size={28} color={Colors.purple} variant="Bold" />
              <Text style={styles.aiModalTitle}>AI Gift Suggestions</Text>
            </View>
            <Text style={styles.aiModalSubtitle}>
              Based on her interests, conversations, and preferences
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.suggestionsScroll}>
              {aiSuggestions.map((suggestion) => (
                <View key={suggestion.id} style={styles.suggestionCard}>
                  <View style={styles.suggestionHeader}>
                    <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceText}>{suggestion.confidence}% match</Text>
                    </View>
                  </View>
                  <Text style={styles.suggestionReason}>💡 {suggestion.reason}</Text>
                  <View style={styles.suggestionDetails}>
                    <View style={styles.suggestionDetailItem}>
                      <Text style={styles.suggestionDetailLabel}>Price:</Text>
                      <Text style={styles.suggestionDetailValue}>{suggestion.price}</Text>
                    </View>
                    <View style={styles.suggestionDetailItem}>
                      <Text style={styles.suggestionDetailLabel}>For:</Text>
                      <Text style={styles.suggestionDetailValue}>{suggestion.occasion}</Text>
                    </View>
                  </View>
                  <View style={styles.suggestionActions}>
                    <TouchableOpacity style={styles.suggestionActionButton} activeOpacity={0.7}>
                      <LinkIcon size={18} color={Colors.purple} variant="Outline" />
                      <Text style={styles.suggestionActionText}>View Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.suggestionActionButton} activeOpacity={0.7}>
                      <ShoppingCart size={18} color={Colors.purple} variant="Outline" />
                      <Text style={styles.suggestionActionText}>Add to Ideas</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAIModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Gift Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Gift Idea</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Gift Title</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="What's the gift?"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Occasion</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Birthday, Anniversary, etc."
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Budget</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="$50-100"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Priority</Text>
                <View style={styles.priorityOptions}>
                  {['High', 'Medium', 'Low'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[styles.priorityOption, { backgroundColor: `${getPriorityColor(priority)}15` }]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.priorityOptionText, { color: getPriorityColor(priority) }]}>
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputMultiline]}
                  placeholder="Why this gift? Any special notes..."
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Save Idea</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: '#FAFAFA' },
  navButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.text },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  aiBanner: { marginBottom: Spacing.xl, borderRadius: BorderRadius.lg, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  aiBannerGradient: { padding: Spacing.lg },
  aiBannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  aiBannerTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  aiBannerSubtitle: { fontSize: FontSizes.sm, color: Colors.textWhite, opacity: 0.9 },
  aiBannerArrow: { fontSize: 24, color: Colors.textWhite },
  tabs: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: 4, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  tabActive: { backgroundColor: Colors.purple },
  tabText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.textSecondary },
  tabTextActive: { color: Colors.textWhite },
  tabContent: { gap: Spacing.md },
  ideaCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  ideaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  ideaTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, flex: 1 },
  priorityBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  priorityText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
  ideaRow: { flexDirection: 'row', marginBottom: 4 },
  ideaLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, width: 80 },
  ideaValue: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.text, flex: 1 },
  ideaNotes: { fontSize: FontSizes.sm, color: Colors.text, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  historyCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  historyHeaderText: { flex: 1 },
  historyTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text },
  historyDate: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  historyDetails: { gap: 4, marginBottom: Spacing.sm },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, width: 80 },
  historyValue: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.text },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm },
  statusText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold, color: '#10B981' },
  reactionContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  reactionText: { fontSize: FontSizes.sm, color: Colors.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '85%' },
  aiModal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  aiModalHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xl, marginBottom: Spacing.xs },
  aiModalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text },
  aiModalSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  suggestionsScroll: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  suggestionCard: { backgroundColor: '#F3F0FF', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  suggestionTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, flex: 1 },
  confidenceBadge: { backgroundColor: Colors.purple, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  confidenceText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold, color: Colors.textWhite },
  suggestionReason: { fontSize: FontSizes.sm, color: Colors.text, marginBottom: Spacing.sm, fontStyle: 'italic' },
  suggestionDetails: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  suggestionDetailItem: { flexDirection: 'row', gap: 4 },
  suggestionDetailLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  suggestionDetailValue: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text },
  suggestionActions: { flexDirection: 'row', gap: Spacing.sm },
  suggestionActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: Colors.background, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  suggestionActionText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.purple },
  modalSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: Spacing.sm },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.md, color: Colors.text, minHeight: 48 },
  modalInputMultiline: { minHeight: 100 },
  priorityOptions: { flexDirection: 'row', gap: Spacing.sm },
  priorityOption: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  priorityOptionText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  closeButton: { marginHorizontal: Spacing.xl, paddingVertical: Spacing.md, alignItems: 'center', backgroundColor: Colors.purple, borderRadius: BorderRadius.full },
  closeButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.textWhite },
});
