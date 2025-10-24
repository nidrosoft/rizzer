/**
 * Event Card Component
 * Displays upcoming events with date-friendly indicators
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Calendar, Clock, Location, People, Heart, Share } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { EventCardProps } from '@/types/discovery';

const getEventImage = (eventId: string) => {
  const images = [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', // Concert
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', // Festival
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', // Art
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', // Outdoor
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', // Event
  ];
  const hash = eventId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

export default function EventCard({ event, onPress, onInterested, onShare }: EventCardProps) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(event.id);
  };

  const handleInterested = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onInterested(event.id);
  };

  const handleShare = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onShare(event.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      {/* Image Section with Price */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getEventImage(event.id) }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        
        {/* Price Badge on Top Right */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{event.price}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Category Badge + Date-Friendly Badge + Heart */}
        <View style={styles.headerRow}>
          <View style={styles.badgesRow}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.categoryBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.categoryText}>{event.category}</Text>
            </LinearGradient>
            
            {event.isDateFriendly && (
              <View style={styles.dateFriendlyBadge}>
                <Text style={styles.dateFriendlyText}>Date-Friendly</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity style={styles.heartButton} onPress={handleInterested} activeOpacity={0.7}>
            <Heart size={22} color={Colors.purple} variant="Outline" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>

        {/* Date, Time, Location with Colorful Icons */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={14} color="#EF4444" variant="Bold" />
            <Text style={styles.infoText}>{event.date}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={14} color="#3B82F6" variant="Bold" />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Location size={14} color="#10B981" variant="Bold" />
            <Text style={styles.infoText} numberOfLines={1}>{event.location || 'Los Angeles, CA'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.md,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  content: {
    gap: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    textTransform: 'capitalize',
  },
  dateFriendlyBadge: {
    backgroundColor: '#AB47BC',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dateFriendlyText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    marginBottom: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
});
