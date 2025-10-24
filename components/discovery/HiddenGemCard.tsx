/**
 * Hidden Gem Card Component
 * Displays local hidden spots and places
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Location, Star1, Heart, Routing } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { HiddenGemCardProps } from '@/types/discovery';

const getGemImage = (gemId: string) => {
  const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', // Restaurant
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400', // Cafe
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400', // Park
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400', // Bookstore
    'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400', // Rooftop
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', // Garden
  ];
  const hash = gemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

export default function HiddenGemCard({ gem, onPress, onSave, onGetDirections }: HiddenGemCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(gem.id);
  };

  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSave(gem.id);
  };

  const handleDirections = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onGetDirections(gem.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getGemImage(gem.id) }}
          style={styles.gemImage}
          resizeMode="cover"
        />
        
        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Heart size={18} color={Colors.textWhite} variant="Bold" />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{gem.name}</Text>
          <View style={styles.rating}>
            <Star1 size={14} color="#FFC107" variant="Bold" />
            <Text style={styles.ratingText}>{gem.rating}</Text>
            <Text style={styles.reviewCount}>({gem.reviewCount})</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>{gem.description}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Location size={12} color={Colors.textSecondary} variant="Outline" />
            <Text style={styles.infoText}>{gem.distance}</Text>
          </View>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.priceRange}>{gem.priceRange}</Text>
          <Text style={styles.separator}>•</Text>
          <View style={[styles.statusDot, gem.isOpen && styles.statusDotOpen]} />
          <Text style={[styles.statusText, gem.isOpen && styles.statusTextOpen]}>
            {gem.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>

        {/* Category Tag */}
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{gem.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginRight: Spacing.md,
  },
  imageContainer: {
    height: 160,
    backgroundColor: Colors.backgroundGray,
    position: 'relative',
    overflow: 'hidden',
  },
  gemImage: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  reviewCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.xs,
  },
  priceRange: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
    marginRight: 4,
  },
  statusDotOpen: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    fontWeight: FontWeights.medium,
  },
  statusTextOpen: {
    color: '#10B981',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
});
