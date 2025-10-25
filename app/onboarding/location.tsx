import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Location as LocationIcon, Lamp } from 'iconsax-react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function LocationScreen() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isDetecting, setIsDetecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 4,
    nextRoute: '/onboarding/primaryGoal',
    validateData: () => !!city,
    getDataToSave: () => ({
      location: {
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
        zipCode: zipCode || undefined,
        latitude: latitude,
        longitude: longitude,
      },
    }),
  });

  const detectLocation = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsDetecting(true);

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location access in your device settings to use this feature.'
        );
        setIsDetecting(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        setCity(address.city || '');
        setState(address.region || '');
        setCountry(address.country || '');
        setZipCode(address.postalCode || '');
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);

        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Show fun modal
        setShowModal(true);
      }
    } catch (error: any) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to detect your location. Please try again.'
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const isValid = !!city;

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={16}
      icon={LocationIcon}
      title="Where are you located?"
      helperText="We'll show you events and dates nearby"
      onContinue={saveAndContinue}
      canContinue={isValid && !isSaving && !isDetecting}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Location Card */}
        {city && (
          <View style={styles.locationCard}>
            <View style={styles.mapPlaceholder}>
              <LocationIcon size={48} color={Colors.purple} variant="Bold" />
              <Text style={styles.mapLabel}>My Current Location</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.cityText}>{city}</Text>
              <Text style={styles.stateText}>
                {state && zipCode ? `${state}, ${zipCode}` : state || zipCode || ''}
              </Text>
            </View>
          </View>
        )}

        {/* Detect Button */}
        <TouchableOpacity
          style={styles.detectButtonWrapper}
          onPress={detectLocation}
          disabled={isDetecting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.detectButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isDetecting ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <>
                <LocationIcon size={24} color={Colors.background} variant="Bold" />
                <Text style={styles.detectButtonText}>Detect My Location</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <View style={styles.tipIconCircle}>
              <Lamp size={20} color={Colors.purple} variant="Bold" />
            </View>
            <Text style={styles.tipsTitle}>Location Tips:</Text>
          </View>
          <Text style={styles.tipText}>• Your location helps us show you nearby events</Text>
          <Text style={styles.tipText}>• We'll find dates and matches in your area</Text>
          <Text style={styles.tipText}>• Your exact address is never shared</Text>
        </View>
      </ScrollView>

      {/* Fun Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Haha, you live in {city}! 🎉</Text>
            <Text style={styles.modalMessage}>
              Great choice! We found some awesome matches nearby.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  locationCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(171, 71, 188, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mapLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  locationInfo: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  cityText: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stateText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  detectButtonWrapper: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  detectButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.background,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: Colors.backgroundGray,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
    minWidth: 120,
  },
  modalButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
});
