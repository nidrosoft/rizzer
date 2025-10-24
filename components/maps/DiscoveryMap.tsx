/**
 * Discovery Map Component
 * Shows multiple date ideas, events, and hidden gems on a map
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { Location as LocationIcon, Calendar, Ticket } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { Coordinates, getCurrentLocation, getMapRegion } from '@/utils/locationUtils';

interface MapLocation {
  id: string;
  type: 'date_idea' | 'event' | 'hidden_gem';
  title: string;
  description?: string;
  coordinates: Coordinates;
}

interface DiscoveryMapProps {
  locations: MapLocation[];
  onLocationPress?: (id: string, type: string) => void;
  height?: number;
}

export default function DiscoveryMap({
  locations,
  onLocationPress,
  height = 400,
}: DiscoveryMapProps) {
  const [region, setRegion] = useState(getMapRegion({ latitude: 34.0522, longitude: -118.2437 }));
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location.coordinates);
      setRegion(getMapRegion(location.coordinates, 0.1, 0.1));
    }
  };

  const handleMarkerPress = (location: MapLocation) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onLocationPress?.(location.id, location.type);
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'date_idea':
        return Colors.primary;
      case 'event':
        return Colors.purple;
      case 'hidden_gem':
        return '#4CAF50';
      default:
        return Colors.primary;
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'date_idea':
        return <LocationIcon size={16} color={Colors.textWhite} variant="Bold" />;
      case 'event':
        return <Ticket size={16} color={Colors.textWhite} variant="Bold" />;
      case 'hidden_gem':
        return <Calendar size={16} color={Colors.textWhite} variant="Bold" />;
      default:
        return <LocationIcon size={16} color={Colors.textWhite} variant="Bold" />;
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinates}
            onPress={() => handleMarkerPress(location)}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, { backgroundColor: getMarkerColor(location.type) }]}>
                {getMarkerIcon(location.type)}
              </View>
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{location.title}</Text>
                {location.description && (
                  <Text style={styles.calloutDescription} numberOfLines={2}>
                    {location.description}
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Date Ideas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.purple }]} />
          <Text style={styles.legendText}>Events</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Hidden Gems</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  callout: {
    width: 200,
    padding: Spacing.sm,
  },
  calloutTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  legend: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
});
