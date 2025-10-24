/**
 * Location Map Component
 * Reusable map component for displaying locations
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Location as LocationIcon, Routing, Map1 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { Coordinates, getMapRegion, getDirections } from '@/utils/locationUtils';

interface LocationMapProps {
  coordinates: Coordinates;
  title?: string;
  description?: string;
  height?: number;
  showDirections?: boolean;
  showHeader?: boolean;
}

export default function LocationMap({
  coordinates,
  title,
  description,
  height = 350,
  showDirections = true,
  showHeader = true,
}: LocationMapProps) {
  const [region, setRegion] = useState(getMapRegion(coordinates));

  useEffect(() => {
    setRegion(getMapRegion(coordinates));
  }, [coordinates]);

  const handleGetDirections = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    getDirections(coordinates, title);
  };

  return (
    <View style={styles.wrapper}>
      {showHeader && (
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Map1 size={20} color={Colors.textSecondary} variant="Outline" />
          </View>
          <Text style={styles.sectionTitle}>Location</Text>
        </View>
      )}
      <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        <Marker
          coordinate={coordinates}
          title={title}
          description={description}
        >
          <View style={styles.markerContainer}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.marker}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <LocationIcon size={22} color={Colors.textWhite} variant="Bold" />
            </LinearGradient>
          </View>
        </Marker>
      </MapView>

      {showDirections && (
        <TouchableOpacity
          onPress={handleGetDirections}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.directionsButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Routing size={20} color={Colors.textWhite} variant="Bold" />
            <Text style={styles.directionsText}>Get Directions</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.textWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  directionsButton: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  directionsText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
