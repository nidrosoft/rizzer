/**
 * Memories Category Detail Screen
 * Timeline view with photos, occasions, and descriptions
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Gallery, Heart, More } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function MemoriesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
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

  const handleMemoryPress = (memory: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedMemory(memory);
  };

  // Mock memories data
  const memories = [
    {
      id: '1',
      title: 'First Date at Central Park',
      date: 'January 15, 2024',
      type: 'First Date',
      description: 'Amazing afternoon walk and coffee. She looked beautiful in her blue dress.',
      photos: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
      likes: 12,
    },
    {
      id: '2',
      title: 'Birthday Surprise',
      date: 'March 22, 2024',
      type: 'Birthday',
      description: 'Organized a surprise party with all her friends. She was so happy!',
      photos: ['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=4', 'https://picsum.photos/400/300?random=5'],
      likes: 24,
    },
    {
      id: '3',
      title: 'Weekend Getaway',
      date: 'June 10, 2024',
      type: 'Trip',
      description: 'Beautiful beach vacation. Sunset walks and amazing food.',
      photos: ['https://picsum.photos/400/300?random=6', 'https://picsum.photos/400/300?random=7'],
      likes: 18,
    },
    {
      id: '4',
      title: 'Cooking Together',
      date: 'September 5, 2024',
      type: 'Activity',
      description: 'Made homemade pasta from scratch. Messy but so much fun!',
      photos: ['https://picsum.photos/400/300?random=8'],
      likes: 8,
    },
  ];

  const getTypeColor = (type: string) => {
    const colors: any = {
      'First Date': '#FF6B9D',
      'Birthday': '#8B5CF6',
      'Trip': '#2196F3',
      'Activity': '#10B981',
      'Anniversary': '#EC4899',
      'Special': '#F59E0B',
    };
    return colors[type] || Colors.purple;
  };

  const getTypeIcon = (type: string) => {
    const icons: any = {
      'First Date': '💕',
      'Birthday': '🎂',
      'Trip': '✈️',
      'Activity': '🎨',
      'Anniversary': '💍',
      'Special': '⭐',
    };
    return icons[type] || '📸';
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
        <Text style={styles.headerTitle}>Memories</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
          <More size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Gallery size={20} color={Colors.purple} variant="Bold" />
            <Text style={styles.statText}>{memories.length} Memories</Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={20} color="#FF6B9D" variant="Bold" />
            <Text style={styles.statText}>{memories.reduce((acc, m) => acc + m.likes, 0)} Likes</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {memories.map((memory, index) => (
            <View key={memory.id} style={styles.timelineItem}>
              {/* Timeline Line */}
              {index < memories.length - 1 && <View style={styles.timelineLine} />}
              
              {/* Timeline Dot */}
              <View style={[styles.timelineDot, { backgroundColor: getTypeColor(memory.type) }]}>
                <Text style={styles.timelineDotIcon}>{getTypeIcon(memory.type)}</Text>
              </View>

              {/* Memory Card */}
              <TouchableOpacity
                style={styles.memoryCard}
                onPress={() => handleMemoryPress(memory)}
                activeOpacity={0.7}
              >
                {/* Header */}
                <View style={styles.memoryHeader}>
                  <View style={styles.memoryHeaderLeft}>
                    <Text style={styles.memoryTitle}>{memory.title}</Text>
                    <Text style={styles.memoryDate}>{memory.date}</Text>
                  </View>
                  <View style={[styles.memoryTypeBadge, { backgroundColor: `${getTypeColor(memory.type)}15` }]}>
                    <Text style={[styles.memoryTypeText, { color: getTypeColor(memory.type) }]}>
                      {memory.type}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.memoryDescription}>{memory.description}</Text>

                {/* Photo Grid */}
                <View style={styles.photoGrid}>
                  {memory.photos.slice(0, 3).map((photo, photoIndex) => (
                    <View
                      key={photoIndex}
                      style={[
                        styles.photoContainer,
                        memory.photos.length === 1 && styles.photoContainerFull,
                        memory.photos.length === 2 && styles.photoContainerHalf,
                      ]}
                    >
                      <Image source={{ uri: photo }} style={styles.photo} />
                      {photoIndex === 2 && memory.photos.length > 3 && (
                        <View style={styles.photoOverlay}>
                          <Text style={styles.photoOverlayText}>+{memory.photos.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {/* Footer */}
                <View style={styles.memoryFooter}>
                  <View style={styles.memoryLikes}>
                    <Heart size={16} color="#FF6B9D" variant="Bold" />
                    <Text style={styles.memoryLikesText}>{memory.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
        onDelete={handleDelete}
        title="Manage Memories"
        deleteModalVisible={showDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={confirmDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => setShowDeleteModal(false)}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage="This action cannot be undone. All memories and photos will be permanently removed."
        archiveMessage="Memories will be moved to archives. You can restore them anytime."
      />

      {/* Add Memory Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Memory</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Memory Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {['First Date', 'Birthday', 'Trip', 'Activity', 'Anniversary', 'Special'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeOption, { backgroundColor: `${getTypeColor(type)}15` }]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.typeOptionIcon}>{getTypeIcon(type)}</Text>
                    <Text style={[styles.typeOptionText, { color: getTypeColor(type) }]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Title</Text>
              <View style={styles.modalInput}>
                <Text style={styles.modalInputPlaceholder}>Enter memory title...</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Date</Text>
              <View style={styles.modalInput}>
                <Text style={styles.modalInputPlaceholder}>Select date...</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Description</Text>
              <View style={[styles.modalInput, styles.modalInputMultiline]}>
                <Text style={styles.modalInputPlaceholder}>Describe this memory...</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Photos</Text>
              <TouchableOpacity style={styles.photoUploadButton} activeOpacity={0.7}>
                <Gallery size={24} color={Colors.purple} variant="Outline" />
                <Text style={styles.photoUploadText}>Add Photos</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Save Memory</Text>
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

      {/* Memory Detail Modal */}
      <Modal
        visible={selectedMemory !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMemory(null)}
      >
        <View style={styles.detailModalOverlay}>
          <TouchableOpacity
            style={styles.detailModalClose}
            onPress={() => setSelectedMemory(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailModalCloseText}>✕</Text>
          </TouchableOpacity>
          {selectedMemory && (
            <View style={styles.detailModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.detailTitle}>{selectedMemory.title}</Text>
                <Text style={styles.detailDate}>{selectedMemory.date}</Text>
                <View style={[styles.detailTypeBadge, { backgroundColor: `${getTypeColor(selectedMemory.type)}15` }]}>
                  <Text style={[styles.detailTypeText, { color: getTypeColor(selectedMemory.type) }]}>
                    {getTypeIcon(selectedMemory.type)} {selectedMemory.type}
                  </Text>
                </View>
                <Text style={styles.detailDescription}>{selectedMemory.description}</Text>
                <View style={styles.detailPhotos}>
                  {selectedMemory.photos.map((photo: string, index: number) => (
                    <Image key={index} source={{ uri: photo }} style={styles.detailPhoto} />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
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
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  statText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text },
  timeline: { position: 'relative' },
  timelineItem: { position: 'relative', paddingLeft: 60, marginBottom: Spacing.xl },
  timelineLine: { position: 'absolute', left: 27, top: 56, bottom: -24, width: 2, backgroundColor: Colors.borderLight },
  timelineDot: { position: 'absolute', left: 16, top: 16, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FAFAFA' },
  timelineDotIcon: { fontSize: 12 },
  memoryCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  memoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  memoryHeaderLeft: { flex: 1 },
  memoryTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: 4 },
  memoryDate: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  memoryTypeBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  memoryTypeText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold },
  memoryDescription: { fontSize: FontSizes.sm, color: Colors.text, lineHeight: 20, marginBottom: Spacing.md },
  photoGrid: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.sm },
  photoContainer: { flex: 1, aspectRatio: 1, borderRadius: BorderRadius.md, overflow: 'hidden', position: 'relative' },
  photoContainerFull: { flex: 1 },
  photoContainerHalf: { flex: 1 },
  photo: { width: '100%', height: '100%' },
  photoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  photoOverlayText: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textWhite },
  memoryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memoryLikes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memoryLikesText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  addModal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: Spacing.sm },
  typeScroll: { flexDirection: 'row' },
  typeOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, marginRight: Spacing.sm },
  typeOptionIcon: { fontSize: 16, marginRight: 4 },
  typeOptionText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, minHeight: 48 },
  modalInputMultiline: { minHeight: 100 },
  modalInputPlaceholder: { fontSize: FontSizes.md, color: Colors.textSecondary },
  photoUploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F0FF', borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.sm },
  photoUploadText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', padding: Spacing.xl },
  detailModalClose: { position: 'absolute', top: 60, right: 24, width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  detailModalCloseText: { fontSize: 24, color: Colors.text },
  detailModal: { backgroundColor: Colors.background, borderRadius: BorderRadius.xl, padding: Spacing.xl, maxHeight: '80%' },
  detailTitle: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: Spacing.xs },
  detailDate: { fontSize: FontSizes.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  detailTypeBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, marginBottom: Spacing.md },
  detailTypeText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  detailDescription: { fontSize: FontSizes.md, color: Colors.text, lineHeight: 24, marginBottom: Spacing.lg },
  detailPhotos: { gap: Spacing.sm },
  detailPhoto: { width: '100%', aspectRatio: 4/3, borderRadius: BorderRadius.lg },
});
