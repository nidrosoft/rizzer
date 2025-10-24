/**
 * Location Utilities
 * Functions for maps, geocoding, and location services
 */

import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  state?: string;
}

// Request location permissions
export const requestLocationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permission Required',
        'Location access is needed to show nearby dates and events.',
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Geocode address to coordinates
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    const results = await Location.geocodeAsync(address);
    if (results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (coordinates: Coordinates): Promise<string | null> => {
  try {
    const results = await Location.reverseGeocodeAsync(coordinates);
    if (results.length > 0) {
      const result = results[0];
      return `${result.street || ''}, ${result.city || ''}, ${result.region || ''}`.trim();
    }
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};

// Calculate distance between two coordinates (in miles)
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
    Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Open location in maps app
export const openInMaps = async (
  coordinates: Coordinates,
  label?: string
): Promise<void> => {
  const scheme = Platform.select({
    ios: 'maps:0,0?q=',
    android: 'geo:0,0?q=',
  });
  
  const latLng = `${coordinates.latitude},${coordinates.longitude}`;
  const url = Platform.select({
    ios: `${scheme}${label || 'Location'}@${latLng}`,
    android: `${scheme}${latLng}(${label || 'Location'})`,
  });

  try {
    const supported = await Linking.canOpenURL(url!);
    if (supported) {
      await Linking.openURL(url!);
    } else {
      Alert.alert('Error', 'Unable to open maps application.');
    }
  } catch (error) {
    console.error('Error opening maps:', error);
    Alert.alert('Error', 'Failed to open maps.');
  }
};

// Get directions to location
export const getDirections = async (
  destination: Coordinates,
  destinationLabel?: string
): Promise<void> => {
  try {
    const currentLocation = await getCurrentLocation();
    if (!currentLocation) {
      // If can't get current location, just open destination
      await openInMaps(destination, destinationLabel);
      return;
    }

    const origin = `${currentLocation.coordinates.latitude},${currentLocation.coordinates.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    
    const url = Platform.select({
      ios: `http://maps.apple.com/?saddr=${origin}&daddr=${dest}`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`,
    });

    const supported = await Linking.canOpenURL(url!);
    if (supported) {
      await Linking.openURL(url!);
    } else {
      Alert.alert('Error', 'Unable to open maps for directions.');
    }
  } catch (error) {
    console.error('Error getting directions:', error);
    Alert.alert('Error', 'Failed to get directions.');
  }
};

// Format distance for display
export const formatDistance = (miles: number): string => {
  if (miles < 0.1) return 'Nearby';
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
  return `${miles.toFixed(1)} mi`;
};

// Check if location is within radius (in miles)
export const isWithinRadius = (
  center: Coordinates,
  point: Coordinates,
  radiusMiles: number
): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radiusMiles;
};

// Get region for map display
export const getMapRegion = (
  coordinates: Coordinates,
  latitudeDelta: number = 0.05,
  longitudeDelta: number = 0.05
) => {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

// Mock coordinates for popular LA locations
export const LA_LOCATIONS = {
  griffithPark: { latitude: 34.1341, longitude: -118.2944 },
  santaMonica: { latitude: 34.0195, longitude: -118.4912 },
  hollywood: { latitude: 34.0928, longitude: -118.3287 },
  downtownLA: { latitude: 34.0522, longitude: -118.2437 },
  venice: { latitude: 33.9850, longitude: -118.4695 },
  malibu: { latitude: 34.0259, longitude: -118.7798 },
  pasadena: { latitude: 34.1478, longitude: -118.1445 },
  beverlyHills: { latitude: 34.0736, longitude: -118.4004 },
};
