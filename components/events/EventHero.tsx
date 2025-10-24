/**
 * Event Hero Component
 * Event image/emoji with category badge
 * MAX 80 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface EventHeroProps {
  image: string;
  category: string;
}

export default function EventHero({ image, category }: EventHeroProps) {
  // Use real event image URL
  const eventImageUrl = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'; // Concert/music event
  
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: eventImageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />
      {/* Blur fade gradient overlay - fade to light gray */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(250,250,250,0.3)',
          'rgba(250,250,250,0.7)',
          'rgba(250,250,250,1)'
        ]}
        locations={[0, 0.6, 0.85, 1]}
        style={styles.gradientOverlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    backgroundColor: Colors.backgroundGray,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
    textTransform: 'capitalize',
  },
});
