/**
 * Hidden Gem List Item Component
 * Compact gem card for list views
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Location, Star1, DirectboxSend, Heart } from 'iconsax-react-native';
import { HiddenGem } from '@/types/discovery';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface HiddenGemListItemProps {
  gem: HiddenGem;
  onPress: (id: string) => void;
  onSave: (id: string) => void;
  onGetDirections: (id: string) => void;
}

export default function HiddenGemListItem({ gem, onPress, onSave, onGetDirections }: HiddenGemListItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(gem.id)}
      activeOpacity={0.7}
    >
      {/* Image */}
      <Image
        source={{ uri: gem.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Title & Status */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {gem.name}
          </Text>
          <View style={[styles.statusBadge, gem.isOpen ? styles.openBadge : styles.closedBadge]}>
            <View style={[styles.statusDot, gem.isOpen ? styles.openDot : styles.closedDot]} />
            <Text style={[styles.statusText, gem.isOpen ? styles.openText : styles.closedText]}>
              {gem.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Category */}
        <Text style={styles.category}>{gem.category}</Text>

        {/* Rating & Reviews */}
        <View style={styles.ratingRow}>
          <Star1 size={14} color="#FFA500" variant="Bold" />
          <Text style={styles.rating}>{gem.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({gem.reviewCount})</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.priceRange}>{gem.priceRange}</Text>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Location size={14} color={Colors.textSecondary} variant="Bold" />
          <Text style={styles.distance}>{gem.distance}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.address} numberOfLines={1}>
            {gem.address}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onSave(gem.id);
            }}
            activeOpacity={0.7}
          >
            <Heart size={16} color={Colors.primary} variant="Outline" />
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.directionsButton]}
            onPress={(e) => {
              e.stopPropagation();
              onGetDirections(gem.id);
            }}
            activeOpacity={0.7}
          >
            <DirectboxSend size={16} color={Colors.textWhite} variant="Bold" />
            <Text style={styles.directionsText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundGray,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  openBadge: {
    backgroundColor: '#E8F5E9',
  },
  closedBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  openDot: {
    backgroundColor: '#4CAF50',
  },
  closedDot: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  openText: {
    color: '#4CAF50',
  },
  closedText: {
    color: '#F44336',
  },
  category: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: 4,
  },
  rating: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  reviews: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginHorizontal: 2,
  },
  priceRange: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: 4,
  },
  distance: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  address: {
    flex: 1,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  directionsButton: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  directionsText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
});
