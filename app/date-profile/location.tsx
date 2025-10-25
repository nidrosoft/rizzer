import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ExpoLocation from 'expo-location';
import { Location, GpsSlash } from 'iconsax-react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';
import { useAuthStore } from '@/store/authStore';

export default function LocationScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [city, setCity] = useState(draft.location?.city || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    updateDraft({
      location: {
        city: city.trim(),
      },
    });
    
    await saveDraft();
    setCurrentStep(6);
    router.push('/date-profile/photo');
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
    
    updateDraft({
      location: {
        city: city.trim(),
      },
    });
    
    await saveDraft();
    router.back();
  };

  const handleUseSameLocation = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsDetecting(true);

    try {
      // Get user's location from their profile or detect it
      const userLocation = user?.location;
      
      if (userLocation?.city) {
        // Use saved location from user profile
        setCity(userLocation.city);
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        // Detect current location
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Please enable location access to use this feature.'
          );
          setIsDetecting(false);
          return;
        }

        const location = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });

        const [address] = await ExpoLocation.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address?.city) {
          setCity(address.city);
          if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      }
    } catch (error: any) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to detect your location. Please enter manually.'
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const canContinue = city.trim().length > 0;

  return (
    <OnboardingLayout
      currentStep={6}
      totalSteps={13}
      icon={Location}
      title="Where do they live?"
      helperText="Location helps us suggest nearby date spots and activities"
      onContinue={handleContinue}
      canContinue={canContinue}
      showSkip={false}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <View style={styles.container}>
        {/* Same Location Button */}
        <TouchableOpacity
          style={styles.sameLocationButton}
          onPress={handleUseSameLocation}
          disabled={isDetecting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.sameLocationGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isDetecting ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <>
                <Location size={20} color={Colors.background} variant="Bold" />
                <Text style={styles.sameLocationText}>Same as My Location</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.orText}>or enter manually</Text>

        {/* Manual Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="City, State or Country"
            placeholderTextColor={Colors.textLight}
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <View style={styles.underline} />
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  sameLocationButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  sameLocationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  sameLocationText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.background,
  },
  orText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.xs,
  },
});
