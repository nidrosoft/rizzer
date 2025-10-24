import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Gallery, Trash, Lamp } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { uploadPhoto, deletePhoto } from '@/lib/storage';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

export default function PhotosScreen() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  // Get user ID from Supabase session on mount
  React.useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else if (user?.id) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, [user]);

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 13,
    nextRoute: '/onboarding/lookingFor',
    validateData: () => photo !== null,
    getDataToSave: () => ({ photos: photo ? [photo] : [] }),
  });

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is required to upload photos.');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please wait a moment and try again.');
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setUploading(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const upload = await uploadPhoto(result.assets[0].uri, userId);

        if (upload.success && upload.url) {
          setPhoto(upload.url);
          if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } else {
          Alert.alert('Upload Failed', upload.error || 'Failed to upload photo');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to take photo');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please wait a moment and try again.');
      return;
    }

    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setUploading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const upload = await uploadPhoto(result.assets[0].uri, userId);

        if (upload.success && upload.url) {
          setPhoto(upload.url);
          if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } else {
          Alert.alert('Upload Failed', upload.error || 'Failed to upload photo');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (photo) {
              await deletePhoto(photo);
              setPhoto(null);

              if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <OnboardingLayout
      currentStep={13}
      totalSteps={13}
      icon={Camera}
      title="Add your profile photo"
      helperText="Show your best self with a clear, recent photo"
      onContinue={saveAndContinue}
      canContinue={photo !== null && !isSaving && !uploading}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo Preview Card */}
        <View style={styles.photoCard}>
          {uploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.purple} />
              <Text style={styles.loadingText}>Uploading...</Text>
            </View>
          ) : photo ? (
            <>
              <Image source={{ uri: photo }} style={styles.photoImage} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePhoto}
                activeOpacity={0.7}
              >
                <Trash size={20} color={Colors.background} variant="Bold" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Camera size={48} color={Colors.textLight} variant="Outline" />
              <Text style={styles.placeholderText}>Your photo will appear here</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTakePhoto}
            disabled={uploading}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconCircle}>
              <Camera size={24} color={Colors.text} variant="Bold" />
            </View>
            <Text style={styles.actionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleUploadPhoto}
            disabled={uploading}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconCircle}>
              <Gallery size={24} color={Colors.text} variant="Bold" />
            </View>
            <Text style={styles.actionText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <View style={styles.tipIconCircle}>
              <Lamp size={20} color={Colors.purple} variant="Bold" />
            </View>
            <Text style={styles.tipsTitle}>Photo Tips:</Text>
          </View>
          <Text style={styles.tipText}>• Show your face clearly</Text>
          <Text style={styles.tipText}>• Use a recent photo</Text>
          <Text style={styles.tipText}>• Smile and be yourself</Text>
          <Text style={styles.tipText}>• Good lighting makes a difference</Text>
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  photoCard: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
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
    fontWeight: FontWeights.medium,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeholderText: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
    fontWeight: FontWeights.medium,
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  tipsContainer: {
    backgroundColor: 'rgba(171, 71, 188, 0.08)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(171, 71, 188, 0.2)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  tipIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(171, 71, 188, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
});
