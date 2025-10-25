import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Location as LocationIcon, Lamp, TickCircle } from 'iconsax-react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import AlertModal from '@/components/ui/AlertModal';
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
    stepNumber: 5,
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
      currentStep={5}
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
        {city && latitude && longitude && (
          <View style={styles.locationCard}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title="Your Location"
                  pinColor={Colors.purple}
                />
              </MapView>
              <View style={styles.mapOverlay}>
                <LocationIcon size={24} color={Colors.textWhite} variant="Bold" />
                <Text style={styles.mapLabel}>My Current Location</Text>
              </View>
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
            <Lamp size={20} color={Colors.textWhite} variant="Bold" />
            <Text style={styles.tipsTitle}>Location Tips:</Text>
          </View>
          <Text style={styles.tipText}>• Your location helps us show you nearby events</Text>
          <Text style={styles.tipText}>• We'll find dates and matches in your area</Text>
          <Text style={styles.tipText}>• Your exact address is never shared</Text>
        </View>
      </ScrollView>

      {/* Location Confirmation Modal */}
      <AlertModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        icon={<TickCircle size={24} color={Colors.success || Colors.purple} variant="Bold" />}
        title={`Perfect! You're in ${city}!`}
        message="We're already thinking about amazing date ideas and experiences in your area!"
        primaryButtonText="Sounds good!"
      />
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
  mapContainer: {
    height: 200,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  mapLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
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
    backgroundColor: Colors.text,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
    marginLeft: Spacing.xs,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});
