import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Gallery, Camera } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import Toast from '@/components/Toast';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function PhotoScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [photoUri, setPhotoUri] = useState<string | null>(draft.primary_photo || null);
  const [showToast, setShowToast] = useState(false);

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (photoUri) {
      updateDraft({ primary_photo: photoUri });
    }
    
    await saveDraft();
    setCurrentStep(7);
    router.push('/date-profile/relationship-stage');
  };

  const handleCancel = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const handleSaveAsDraft = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (photoUri) {
      updateDraft({ primary_photo: photoUri });
    }
    
    await saveDraft();
    router.back();
  };

  const handleChoosePhoto = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <OnboardingLayout
      currentStep={7}
      totalSteps={13}
      icon={Gallery}
      title="Add a photo"
      helperText="A photo helps you remember them and makes the profile more personal"
      onContinue={handleContinue}
      canContinue={!!photoUri}
      showSkip={false}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <View style={styles.container}>
        <View style={styles.photoPlaceholder}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoImage} />
          ) : (
            <View style={styles.emptyPhoto}>
              <Gallery size={48} color={Colors.textLight} variant="Outline" />
              <Text style={styles.emptyPhotoText}>No photo yet</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.photoButton}
            onPress={handleChoosePhoto}
            activeOpacity={0.7}
          >
            <Gallery size={24} color={Colors.text} variant="Bold" />
            <Text style={styles.photoButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.photoButton}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <Camera size={24} color={Colors.text} variant="Bold" />
            <Text style={styles.photoButtonText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          💡 You can always add or change the photo later from the profile
        </Text>
      </View>

      {/* Success Toast */}
      <Toast
        message="Date profile created successfully! 🎉"
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  emptyPhoto: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyPhotoText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
  photoPreview: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  photoPreviewText: {
    fontSize: 64,
  },
  photoPreviewLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  buttonsContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.text,
  },
  photoButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  note: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
