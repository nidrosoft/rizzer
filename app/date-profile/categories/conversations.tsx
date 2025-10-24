/**
 * Conversations Category Detail Screen
 * Important conversation notes and topics
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { MessageText, Edit2, Trash, More } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function ConversationsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
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

  const handleMenu = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleDeleteAction = () => {
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

  const handleEdit = (conversation: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedConversation(conversation);
  };

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      topic: 'Future Plans & Dreams',
      date: 'October 18, 2024',
      category: 'Important',
      notes: 'Talked about moving to the city together next year. She wants to open her own salon. I mentioned my promotion opportunity.',
      tags: ['Future', 'Career', 'Goals'],
    },
    {
      id: '2',
      topic: 'Family Discussion',
      date: 'October 10, 2024',
      category: 'Personal',
      notes: 'She opened up about her relationship with her parents. Wants me to meet them during Thanksgiving.',
      tags: ['Family', 'Relationships'],
    },
    {
      id: '3',
      topic: 'Travel Bucket List',
      date: 'September 28, 2024',
      category: 'Fun',
      notes: 'Made a list of places we want to visit together: Japan, Italy, Greece. She really wants to see the cherry blossoms in Tokyo.',
      tags: ['Travel', 'Dreams', 'Adventure'],
    },
    {
      id: '4',
      topic: 'Health & Wellness Goals',
      date: 'September 15, 2024',
      category: 'Lifestyle',
      notes: 'Both committed to working out together 3x a week. She wants to try yoga, I suggested we do morning runs.',
      tags: ['Health', 'Fitness', 'Goals'],
    },
    {
      id: '5',
      topic: 'Favorite Childhood Memories',
      date: 'August 22, 2024',
      category: 'Personal',
      notes: 'She told me about her summers at her grandparents farm. Loved feeding the chickens and picking strawberries.',
      tags: ['Childhood', 'Stories', 'Bonding'],
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Important': '#FF6B9D',
      'Personal': '#8B5CF6',
      'Fun': '#10B981',
      'Lifestyle': '#2196F3',
      'Deep': '#EC4899',
    };
    return colors[category] || Colors.purple;
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      'Important': '⭐',
      'Personal': '💭',
      'Fun': '🎉',
      'Lifestyle': '🌱',
      'Deep': '💜',
    };
    return icons[category] || '💬';
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
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
          <More size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <MessageText size={20} color={Colors.purple} variant="Bold" />
            <Text style={styles.statText}>{conversations.length} Conversations</Text>
          </View>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsList}>
          {conversations.map((conversation) => (
            <View key={conversation.id} style={styles.conversationCard}>
              {/* Header */}
              <View style={styles.conversationHeader}>
                <View style={styles.conversationHeaderLeft}>
                  <View style={styles.conversationTitleRow}>
                    <Text style={styles.conversationIcon}>{getCategoryIcon(conversation.category)}</Text>
                    <Text style={styles.conversationTopic}>{conversation.topic}</Text>
                  </View>
                  <Text style={styles.conversationDate}>{conversation.date}</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(conversation.category)}15` }]}>
                  <Text style={[styles.categoryText, { color: getCategoryColor(conversation.category) }]}>
                    {conversation.category}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              <Text style={styles.conversationNotes} numberOfLines={3}>
                {conversation.notes}
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {conversation.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.conversationActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(conversation)}
                  activeOpacity={0.7}
                >
                  <Edit2 size={18} color={Colors.purple} variant="Outline" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Trash size={18} color="#FF4444" variant="Outline" />
                  <Text style={[styles.actionButtonText, { color: '#FF4444' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* Category Action Sheet */}
      <CategoryActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onArchive={handleArchive}
        onDelete={handleDeleteAction}
        title="Manage Conversations"
        deleteModalVisible={showDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={confirmDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => setShowDeleteModal(false)}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage="This action cannot be undone. All conversation notes will be permanently removed."
        archiveMessage="Conversations will be moved to archives. You can restore them anytime."
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal || selectedConversation !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddModal(false);
          setSelectedConversation(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {selectedConversation ? 'Edit Conversation' : 'Add Conversation'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Topic</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="What did you talk about?"
                  placeholderTextColor={Colors.textSecondary}
                  defaultValue={selectedConversation?.topic}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {['Important', 'Personal', 'Fun', 'Lifestyle', 'Deep'].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[styles.categoryOption, { backgroundColor: `${getCategoryColor(category)}15` }]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryOptionIcon}>{getCategoryIcon(category)}</Text>
                      <Text style={[styles.categoryOptionText, { color: getCategoryColor(category) }]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Date</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="When did this conversation happen?"
                  placeholderTextColor={Colors.textSecondary}
                  defaultValue={selectedConversation?.date}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputMultiline]}
                  placeholder="Write down the key points..."
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  defaultValue={selectedConversation?.notes}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Tags (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Add tags separated by commas"
                  placeholderTextColor={Colors.textSecondary}
                  defaultValue={selectedConversation?.tags.join(', ')}
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
                <Text style={styles.saveButtonText}>
                  {selectedConversation ? 'Update' : 'Save'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddModal(false);
                setSelectedConversation(null);
              }}
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
  statsCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, justifyContent: 'center' },
  statText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text },
  conversationsList: { gap: Spacing.md },
  conversationCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  conversationHeaderLeft: { flex: 1 },
  conversationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: 4 },
  conversationIcon: { fontSize: 20 },
  conversationTopic: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, flex: 1 },
  conversationDate: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  categoryBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  categoryText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
  conversationNotes: { fontSize: FontSizes.sm, color: Colors.text, lineHeight: 20, marginBottom: Spacing.md },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md },
  tag: { backgroundColor: '#F3F0FF', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  tagText: { fontSize: FontSizes.xs, fontWeight: FontWeights.medium, color: Colors.purple },
  conversationActions: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionButtonText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.purple },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: Spacing.sm },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.md, color: Colors.text, minHeight: 48 },
  modalInputMultiline: { minHeight: 120 },
  categoryScroll: { flexDirection: 'row' },
  categoryOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, marginRight: Spacing.sm },
  categoryOptionIcon: { fontSize: 16, marginRight: 4 },
  categoryOptionText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
});
