/**
 * Date Idea Location Component
 * Location card, map, and tags
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Location } from 'iconsax-react-native';
import LocationMap from '@/components/maps/LocationMap';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface DateIdeaLocationProps {
  location: string;
  address: string;
  coordinates: { latitude: number; longitude: number };
  tags: string[];
}

export default function DateIdeaLocation({
  location,
  address,
  coordinates,
  tags,
}: DateIdeaLocationProps) {
  return (
    <>
      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationCard}>
          <Location size={20} color={Colors.purple} variant="Bold" />
          <View style={styles.locationContent}>
            <Text style={styles.locationName}>{location}</Text>
            <Text style={styles.locationAddress}>{address}</Text>
          </View>
        </View>
      </View>

      {/* Map */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map</Text>
        <LocationMap
          coordinates={coordinates}
          title={location}
          description={address}
          height={250}
        />
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  locationName: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
