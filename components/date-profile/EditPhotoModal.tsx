/**
 * EditPhotoModal Component
 * Bottom sheet modal for editing date profile photo
 * Supports camera, gallery, and remove photo options
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Camera, Gallery, Trash, CloseCircle } from 'iconsax-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { uploadDateProfilePhoto } from '@/lib/storage';

interface EditPhotoModalProps {
  visible: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onPhotoUpdated: (photoUri: string) => void;
  profileId: string;
  profileName: string;
  userId: string;
}

export default function EditPhotoModal({
  visible,
  onClose,
  currentPhoto,
  onPhotoUpdated,
  profileId,
  profileName,
  userId,
}: EditPhotoModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(currentPhoto);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTakePhoto = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device settings to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handleChooseFromGallery = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Photo Library Permission Required',
        'Please enable photo library access in your device settings to choose photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowDeleteConfirm(true);
  };

  const confirmRemovePhoto = () => {
    setSelectedPhoto(undefined);
    setShowDeleteConfirm(false);
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSave = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsUploading(true);

    try {
      let photoUrl = selectedPhoto;

      // Upload to Supabase if it's a local file
      if (selectedPhoto && selectedPhoto.startsWith('file://')) {
        const { success, url, error: uploadError } = await uploadDateProfilePhoto(
          selectedPhoto,
          userId,
          profileId
        );
        
        if (!success || !url) {
          setErrorMessage(uploadError || 'Failed to upload photo. Please try again.');
          setShowErrorModal(true);
          setIsUploading(false);
          return;
        }
        photoUrl = url;
      }

      // Update database
      const { error } = await supabase
        .from('date_profiles')
        .update({ primary_photo: photoUrl || null })
        .eq('id', profileId);

      if (error) throw error;

      // Success - update and close
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      onPhotoUpdated(photoUrl || '');
      onClose();
    } catch (error: any) {
      console.error('Error updating photo:', error);
      setErrorMessage(error.message || 'Failed to update photo. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPhoto(currentPhoto);
    onClose();
  };

  const hasChanges = selectedPhoto !== currentPhoto;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleCancel}
        />
        
        <SafeAreaView style={styles.bottomSheet} edges={['bottom']}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Photo</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <CloseCircle size={28} color={Colors.textSecondary} variant="Bold" />
            </TouchableOpacity>
          </View>

          {/* Photo Preview */}
          <View style={styles.photoPreview}>
            {selectedPhoto ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: selectedPhoto }} style={styles.photo} />
                {/* Trash Icon */}
                <TouchableOpacity 
                  style={styles.trashButton}
                  onPress={handleRemovePhoto}
                  activeOpacity={0.7}
                >
                  <View style={styles.trashIcon}>
                    <Trash size={18} color="#FF4444" variant="Bold" />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.photoPlaceholder}
                onPress={handleChooseFromGallery}
                activeOpacity={0.7}
              >
                <Camera size={48} color={Colors.textSecondary} variant="Outline" />
                <Text style={styles.placeholderText}>No photo selected</Text>
                <Text style={styles.placeholderHint}>Tap to choose photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Camera size={24} color="#2563EB" variant="Bold" />
              </View>
              <Text style={styles.actionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChooseFromGallery}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                <Gallery size={24} color="#7C3AED" variant="Bold" />
              </View>
              <Text style={styles.actionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!hasChanges || isUploading) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isUploading}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteModalIcon}>
              <Trash size={24} color="#FF4444" variant="Bold" />
            </View>
            <Text style={styles.deleteModalTitle}>Remove this photo?</Text>
            <Text style={styles.deleteModalMessage}>
              This will remove the photo from {profileName}'s profile.
            </Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={confirmRemovePhoto}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.deleteButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.deleteButtonText}>Yes, remove</Text>
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
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={[styles.deleteModalIcon, { backgroundColor: '#FFE5E5' }]}>
              <CloseCircle size={24} color="#FF4444" variant="Bold" />
            </View>
            <Text style={styles.deleteModalTitle}>Upload Failed</Text>
            <Text style={styles.deleteModalMessage}>
              {errorMessage}
            </Text>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowErrorModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  photoPreview: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.backgroundGray,
  },
  trashButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  trashIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  placeholderHint: {
    fontSize: FontSizes.xs,
    color: Colors.purple,
    marginTop: Spacing.xs,
    fontWeight: FontWeights.semibold,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  saveButton: {
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.purple,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.border,
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  // Modal styles (matching Rizz delete confirmation)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  deleteButton: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  deleteButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
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
