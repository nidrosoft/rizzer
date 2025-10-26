/**
 * PhotoGallery Component
 * Displays photo gallery with add functionality
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Modal, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Add, Gallery, Camera, Image as ImageIcon, Trash, CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { PhotoGalleryProps } from '@/types/dateProfile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PhotoGallery({ photos, onAddPhoto, onViewPhoto }: PhotoGalleryProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const handleAddPhoto = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowUploadModal(true);
  };

  const handleViewPhoto = (index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPhotoIndex(index);
    setShowPhotoViewer(true);
  };

  const pickImageFromGallery = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1.0,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const photoUris = result.assets.map(asset => asset.uri);
      
      console.log('📸 [PhotoGallery] Selected photos:', {
        count: photoUris.length,
        photos: photoUris
      });
      
      setShowUploadModal(false);
      setIsUploading(true);
      setUploadProgress({ current: 0, total: photoUris.length });
      
      // Pass all selected photo URIs to parent
      await onAddPhoto(photoUris);
      
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1.0,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const photoUri = result.assets[0].uri;
      
      console.log('📸 [PhotoGallery] Took photo:', photoUri);
      
      // Pass photo URI to parent
      onAddPhoto(photoUri);
      
      setShowUploadModal(false);
    }
  };

  const handleDeletePhoto = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Show delete confirmation inside photo viewer
    setShowDeleteConfirm(true);
  };

  const confirmDeletePhoto = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: Delete from server
    setShowDeleteConfirm(false);
    setShowPhotoViewer(false);
  };

  return (
    <>
      <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 Photo Gallery</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Add size={18} color={Colors.textWhite} variant="Outline" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isUploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>
            Uploading {uploadProgress.current} of {uploadProgress.total} photos...
          </Text>
        </View>
      )}

      {photos.length > 0 ? (
        <TouchableOpacity 
          activeOpacity={0.95}
          onPress={() => handleViewPhoto(0)}
        >
          <ScrollView 
            style={styles.photosScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.photoItem}
                  activeOpacity={0.8}
                  onPress={() => handleViewPhoto(index)}
                >
                  <Image 
                    source={{ uri: photo }} 
                    style={styles.photo}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyState}>
          <Gallery size={48} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.emptyText}>No photos yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first memory</Text>
        </View>
      )}
    </View>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.uploadModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Photos</Text>

            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={takePhoto}
                activeOpacity={0.7}
              >
                <View style={styles.uploadIconContainer}>
                  <Camera size={32} color={Colors.purple} variant="Bold" />
                </View>
                <Text style={styles.uploadOptionText}>Take Photo</Text>
                <Text style={styles.uploadOptionSubtext}>Use camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadOption}
                onPress={pickImageFromGallery}
                activeOpacity={0.7}
              >
                <View style={styles.uploadIconContainer}>
                  <ImageIcon size={32} color={Colors.purple} variant="Bold" />
                </View>
                <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
                <Text style={styles.uploadOptionSubtext}>Select multiple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelUploadButton}
              onPress={() => setShowUploadModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelUploadText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Photo Viewer Modal */}
      <Modal
        visible={showPhotoViewer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoViewer(false)}
        statusBarTranslucent
      >
        <View style={styles.photoViewerOverlay}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.photoViewerScroll}
            contentOffset={{ x: selectedPhotoIndex * SCREEN_WIDTH, y: 0 }}
            scrollEnabled={true}
          >
            {photos.map((photo, index) => (
              <View key={index} style={[styles.photoViewerPage, { width: SCREEN_WIDTH }]}>
                <Image source={{ uri: photo }} style={styles.photoViewerImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          <View style={styles.photoViewerHeader} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.photoViewerButton}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowPhotoViewer(false);
              }}
              activeOpacity={0.7}
            >
              <CloseCircle size={32} color={Colors.textWhite} variant="Bold" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoViewerButton}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                handleDeletePhoto();
              }}
              activeOpacity={0.7}
            >
              <Trash size={28} color={Colors.textWhite} variant="Bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.photoViewerFooter}>
            <Text style={styles.photoViewerCounter}>
              {selectedPhotoIndex + 1} / {photos.length}
            </Text>
          </View>

          {/* Delete Confirmation Modal - Inside Photo Viewer */}
          {showDeleteConfirm && (
            <View style={styles.deleteModalOverlay}>
              <View style={styles.deleteModal}>
                <View style={styles.deleteModalIcon}>
                  <Trash size={24} color="#FF4444" variant="Bold" />
                </View>
                <Text style={styles.deleteModalTitle}>Delete this photo?</Text>
                <Text style={styles.deleteModalMessage}>
                  This photo will be permanently removed from the gallery.
                </Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={confirmDeletePhoto}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    style={styles.deleteButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.deleteButtonText}>Yes, delete</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowDeleteConfirm(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosScrollView: {
    maxHeight: 400,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundGray,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  uploadModal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  uploadOption: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.purple}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  uploadOptionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  uploadOptionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cancelUploadButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
  },
  cancelUploadText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  photoViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  photoViewerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 40,
    paddingBottom: Spacing.md,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  photoViewerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
  },
  photoViewerScroll: {
    flex: 1,
  },
  photoViewerPage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoViewerImage: {
    width: '100%',
    height: '100%',
  },
  photoViewerFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  photoViewerCounter: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  uploadingContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  uploadingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
    textAlign: 'center',
  },
  deleteModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  deleteModal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    maxWidth: 340,
    width: '85%',
    position: 'relative',
  },
  deleteModalIcon: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    lineHeight: 28,
  },
  deleteModalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  deleteButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  deleteButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  modalCancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
