/**
 * Discovery Map View
 * Shows all date ideas, events, and hidden gems on an interactive map
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import DiscoveryMap from '@/components/maps/DiscoveryMap';
import { LA_LOCATIONS } from '@/utils/locationUtils';

export default function MapView() {
  const router = useRouter();

  // Mock locations for demonstration
  const locations = [
    {
      id: '1',
      type: 'date_idea' as const,
      title: 'Sunset Picnic at Griffith Park',
      description: 'Romantic outdoor experience with stunning views',
      coordinates: LA_LOCATIONS.griffithPark,
    },
    {
      id: '2',
      type: 'date_idea' as const,
      title: 'Beach Walk at Santa Monica',
      description: 'Relaxing stroll along the pier',
      coordinates: LA_LOCATIONS.santaMonica,
    },
    {
      id: '3',
      type: 'event' as const,
      title: 'Hollywood Bowl Concert',
      description: 'Live music under the stars',
      coordinates: LA_LOCATIONS.hollywood,
    },
    {
      id: '4',
      type: 'event' as const,
      title: 'Downtown Food Festival',
      description: 'Taste the best of LA cuisine',
      coordinates: LA_LOCATIONS.downtownLA,
    },
    {
      id: '5',
      type: 'hidden_gem' as const,
      title: 'Venice Canals',
      description: 'Hidden romantic walkway',
      coordinates: LA_LOCATIONS.venice,
    },
    {
      id: '6',
      type: 'hidden_gem' as const,
      title: 'Malibu Secret Beach',
      description: 'Secluded beach spot',
      coordinates: LA_LOCATIONS.malibu,
    },
    {
      id: '7',
      type: 'date_idea' as const,
      title: 'Huntington Library Gardens',
      description: 'Beautiful botanical gardens',
      coordinates: LA_LOCATIONS.pasadena,
    },
    {
      id: '8',
      type: 'event' as const,
      title: 'Beverly Hills Art Walk',
      description: 'Monthly art gallery tour',
      coordinates: LA_LOCATIONS.beverlyHills,
    },
  ];

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleLocationPress = (id: string, type: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Navigate to detail page based on type
    if (type === 'date_idea') {
      router.push(`/discovery/date-idea/${id}`);
    } else if (type === 'event') {
      console.log('Navigate to event:', id);
    } else if (type === 'hidden_gem') {
      console.log('Navigate to hidden gem:', id);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <View style={styles.backCircle}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </View>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Map View</Text>
          <Text style={styles.headerSubtitle}>{locations.length} locations</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <DiscoveryMap
          locations={locations}
          onLocationPress={handleLocationPress}
          height={700}
        />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Tap any marker to view details or get directions
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  mapContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.purple}15`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.purple}30`,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 18,
  },
});
