/**
 * Memories Category Detail Screen
 * Timeline view with photos, occasions, and descriptions
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Gallery, Heart, More, Calendar } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import CachedImage from '@/components/ui/CachedImage';
import NetworkError from '@/components/ui/NetworkError';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { getMemories, createMemory, deleteMemory } from '@/lib/memories';
import { Memory, MemoryType } from '@/types/memory';
import { useToast } from '@/contexts/ToastContext';

export default function MemoriesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  
  // State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    memory_type: 'Special' as MemoryType,
    photo_uris: [] as string[],
    tags: [] as string[],
  });

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

  // Load memories on mount
  useEffect(() => {
    loadMemories();
  }, [id]);

  const loadMemories = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setNetworkError(false);
    
    const { success, memories: data, error } = await getMemories(id as string);
    
    if (success && data) {
      setMemories(data);
      setNetworkError(false);
    } else {
      // Check if it's a network error
      if (error?.includes('network') || error?.includes('connection') || error?.includes('fetch')) {
        setNetworkError(true);
      } else {
        showToast(error || 'Failed to load memories', 'error');
      }
    }
    
    setIsLoading(false);
  };

  const handleMemoryPress = (memory: Memory) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedMemory(memory);
  };

  const handleAddPhotos = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1.0,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      setFormData(prev => ({
        ...prev,
        photo_uris: [...prev.photo_uris, ...uris],
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFormData(prev => ({
      ...prev,
      photo_uris: prev.photo_uris.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsSaving(true);

    const { success, error } = await createMemory({
      date_profile_id: id as string,
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date.toISOString().split('T')[0],
      memory_type: formData.memory_type,
      photo_uris: formData.photo_uris.length > 0 ? formData.photo_uris : undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
    });

    if (success) {
      showToast('Memory created!', 'success');
      setShowAddModal(false);
      resetForm();
      loadMemories(); // Refresh list
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      showToast(error || 'Failed to create memory', 'error');
    }

    setIsSaving(false);
  };

  const handleDeleteMemory = async () => {
    if (!selectedMemory) return;

    setShowDeleteModal(false);
    setIsSaving(true);

    const { success, error } = await deleteMemory(selectedMemory.id);

    if (success) {
      showToast('Memory deleted', 'success');
      setSelectedMemory(null);
      loadMemories(); // Refresh list
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      showToast(error || 'Failed to delete memory', 'error');
    }

    setIsSaving(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date(),
      memory_type: 'Special',
      photo_uris: [],
      tags: [],
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
        {/* Network Error State */}
        {networkError ? (
          <NetworkError
            message="Unable to load memories. Please check your connection."
            onRetry={loadMemories}
          />
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.purple} />
            <Text style={styles.loadingText}>Loading memories...</Text>
          </View>
        ) : (
          <>
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

            {/* Empty State */}
            {memories.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📸</Text>
                <Text style={styles.emptyStateTitle}>No Memories Yet</Text>
                <Text style={styles.emptyStateText}>
                  Start capturing your special moments together!
                </Text>
              </View>
            ) : (
              /* Timeline */
              <View style={styles.timeline}>
          {memories.map((memory, index) => (
            <View key={memory.id} style={styles.timelineItem}>
              {/* Timeline Line */}
              {index < memories.length - 1 && <View style={styles.timelineLine} />}
              
              {/* Timeline Dot */}
              <View style={[styles.timelineDot, { backgroundColor: getTypeColor(memory.memory_type) }]}>
                <Text style={styles.timelineDotIcon}>{getTypeIcon(memory.memory_type)}</Text>
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
                    <Text style={styles.memoryDate}>{formatDate(memory.date)}</Text>
                  </View>
                  <View style={[styles.memoryTypeBadge, { backgroundColor: `${getTypeColor(memory.memory_type)}15` }]}>
                    <Text style={[styles.memoryTypeText, { color: getTypeColor(memory.memory_type) }]}>
                      {memory.memory_type}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.memoryDescription}>{memory.description}</Text>

                {/* Photo Grid */}
                <View style={styles.photoGrid}>
                  {memory.photos && memory.photos.slice(0, 3).map((photo, photoIndex) => (
                    <View
                      key={photoIndex}
                      style={[
                        styles.photoContainer,
                        memory.photos.length === 1 && styles.photoContainerFull,
                        memory.photos.length === 2 && styles.photoContainerHalf,
                      ]}
                    >
                      <CachedImage
                        uri={photo}
                        style={styles.photo}
                        contentFit="cover"
                        borderRadius={BorderRadius.md}
                      />
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
            )}
          </>
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
        title="Manage Memories"
        deleteModalVisible={showDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={selectedMemory ? handleDeleteMemory : confirmDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => {
          setShowDeleteModal(false);
          setSelectedMemory(null);
        }}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage={selectedMemory ? "This memory and all its photos will be permanently deleted." : "This action cannot be undone. All memories and photos will be permanently removed."}
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
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Memory Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                  {(['First Date', 'Birthday', 'Trip', 'Activity', 'Anniversary', 'Special'] as MemoryType[]).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        { backgroundColor: `${getTypeColor(type)}15` },
                        formData.memory_type === type && { borderWidth: 2, borderColor: getTypeColor(type) }
                      ]}
                      onPress={() => {
                        if (Platform.OS === 'ios') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setFormData(prev => ({ ...prev, memory_type: type }));
                      }}
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
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter memory title..."
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                  maxLength={100}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Date</Text>
                <TouchableOpacity
                  style={styles.modalInput}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setShowDatePicker(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Calendar size={20} color={Colors.purple} variant="Bold" />
                  <Text style={styles.dateText}>
                    {formData.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') {
                        setShowDatePicker(false);
                      }
                      if (selectedDate) {
                        setFormData(prev => ({ ...prev, date: selectedDate }));
                      }
                    }}
                    onTouchCancel={() => setShowDatePicker(false)}
                  />
                )}
                {showDatePicker && Platform.OS === 'ios' && (
                  <View style={styles.datePickerButtons}>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.datePickerButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Description</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputMultiline]}
                  placeholder="Describe this memory..."
                  placeholderTextColor={Colors.textSecondary}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Photos ({formData.photo_uris.length}/10)</Text>
                {formData.photo_uris.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoPreviewScroll}>
                    {formData.photo_uris.map((uri, index) => (
                      <View key={index} style={styles.photoPreview}>
                        <CachedImage
                          uri={uri}
                          style={styles.photoPreviewImage}
                          contentFit="cover"
                          borderRadius={BorderRadius.md}
                        />
                        <TouchableOpacity
                          style={styles.photoRemoveButton}
                          onPress={() => handleRemovePhoto(index)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.photoRemoveText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
                <TouchableOpacity
                  style={styles.photoUploadButton}
                  onPress={handleAddPhotos}
                  activeOpacity={0.7}
                  disabled={formData.photo_uris.length >= 10}
                >
                  <Gallery size={24} color={formData.photo_uris.length >= 10 ? Colors.textSecondary : Colors.purple} variant="Outline" />
                  <Text style={[styles.photoUploadText, formData.photo_uris.length >= 10 && { color: Colors.textSecondary }]}>
                    {formData.photo_uris.length >= 10 ? 'Maximum photos reached' : 'Add Photos'}
                  </Text>
                </TouchableOpacity>
              </View>

            </ScrollView>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={isSaving}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isSaving ? (
                  <ActivityIndicator color={Colors.textWhite} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Memory</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
              activeOpacity={0.7}
              disabled={isSaving}
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
          {/* Close Button - Top Left */}
          <TouchableOpacity
            style={styles.detailModalCloseButton}
            onPress={() => {
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setSelectedMemory(null);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.detailIconCircle}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
                <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
              </Svg>
            </View>
          </TouchableOpacity>

          {/* Delete Button - Top Right */}
          <TouchableOpacity
            style={styles.detailModalDeleteButton}
            onPress={() => {
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setShowDeleteModal(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.detailIconCircle}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M21 5.98047C17.67 5.65047 14.32 5.48047 10.98 5.48047C9 5.48047 7.02 5.58047 5.04 5.78047L3 5.98047" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M18.85 9.14062L18.2 19.2106C18.09 20.7806 18 22.0006 15.21 22.0006H8.79C6 22.0006 5.91 20.7806 5.8 19.2106L5.15 9.14062" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M10.33 16.5H13.66" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M9.5 12.5H14.5" stroke={Colors.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </View>
          </TouchableOpacity>

          {selectedMemory && (
            <View style={styles.detailModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.detailTitle}>{selectedMemory.title}</Text>
                <Text style={styles.detailDate}>{formatDate(selectedMemory.date)}</Text>
                <View style={[styles.detailTypeBadge, { backgroundColor: `${getTypeColor(selectedMemory.memory_type)}15` }]}>
                  <Text style={[styles.detailTypeText, { color: getTypeColor(selectedMemory.memory_type) }]}>
                    {getTypeIcon(selectedMemory.memory_type)} {selectedMemory.memory_type}
                  </Text>
                </View>
                <Text style={styles.detailDescription}>{selectedMemory.description}</Text>
                {selectedMemory.photos && selectedMemory.photos.length > 0 && (
                  <View style={styles.detailPhotos}>
                    {selectedMemory.photos.map((photo: string, index: number) => (
                      <CachedImage
                        key={index}
                        uri={photo}
                        style={styles.detailPhoto}
                        contentFit="cover"
                        borderRadius={BorderRadius.lg}
                      />
                    ))}
                  </View>
                )}
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
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, minHeight: 48, fontSize: FontSizes.md, color: Colors.text },
  modalInputMultiline: { minHeight: 100, textAlignVertical: 'top' },
  modalInputPlaceholder: { fontSize: FontSizes.md, color: Colors.textSecondary },
  dateText: { fontSize: FontSizes.md, color: Colors.text, marginLeft: Spacing.sm },
  photoPreviewScroll: { marginBottom: Spacing.md },
  photoPreview: { width: 100, height: 100, marginRight: Spacing.sm, borderRadius: BorderRadius.md, overflow: 'hidden', position: 'relative' },
  photoPreviewImage: { width: '100%', height: '100%' },
  photoRemoveButton: { position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  photoRemoveText: { color: Colors.textWhite, fontSize: 14, fontWeight: FontWeights.bold },
  photoUploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F0FF', borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.sm },
  photoUploadText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  datePickerButtons: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  datePickerButton: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  datePickerButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', padding: Spacing.xl },
  detailModalCloseButton: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  detailModalDeleteButton: { position: 'absolute', top: 60, right: 24, zIndex: 10 },
  detailIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  detailModal: { backgroundColor: Colors.background, borderRadius: BorderRadius.xl, padding: Spacing.xl, maxHeight: '80%' },
  detailTitle: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: Spacing.xs },
  detailDate: { fontSize: FontSizes.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  detailTypeBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, marginBottom: Spacing.md },
  detailTypeText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  detailDescription: { fontSize: FontSizes.md, color: Colors.text, lineHeight: 24, marginBottom: Spacing.lg },
  detailPhotos: { gap: Spacing.sm, marginBottom: Spacing.lg },
  detailPhoto: { width: '100%', aspectRatio: 4/3, borderRadius: BorderRadius.lg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xxl * 2 },
  loadingText: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: Spacing.md },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl * 2, paddingHorizontal: Spacing.xl },
  emptyStateIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyStateTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: Spacing.sm },
  emptyStateText: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
