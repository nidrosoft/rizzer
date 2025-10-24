/**
 * Hidden Gem Detail Page
 * Full details for a specific hidden gem with save functionality
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path } from 'react-native-svg';
import { Heart, Share, Clock, Location as LocationIcon, Star1, Routing, DocumentText, Lamp } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { saveFavorite, removeFavorite, isFavorited } from '@/utils/favoritesStorage';
import { FavoriteItem } from '@/types/favorites';
import LocationMap from '@/components/maps/LocationMap';

const getGemImage = (gemId: string) => {
  const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // Restaurant
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', // Cafe
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800', // Park
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', // Bookstore
    'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800', // Rooftop
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', // Garden
  ];
  const hash = gemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images[hash % images.length];
};

const getBadgeColor = (index: number) => {
  const colors = [
    '#E0F2FE', // Light blue
    '#FCE7F3', // Light pink
    '#FEF3C7', // Light yellow
    '#DBEAFE', // Light indigo
    '#E0E7FF', // Light purple
  ];
  return colors[index % colors.length];
};

export default function HiddenGemDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    const saved = await isFavorited(gem.id, 'hidden_gem');
    setIsSaved(saved);
  };

  // Mock data - in real app, fetch by ID
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id || '1';
  const gem = {
    id: itemId,
    name: 'Secret Garden Café',
    description: 'Hidden courtyard café with fairy lights and vintage decor. A cozy spot perfect for intimate conversations, featuring locally sourced coffee and homemade pastries. The garden setting provides a peaceful escape from the city bustle.',
    image: getGemImage(itemId),
    category: 'Cozy Cafés',
    rating: 4.8,
    reviewCount: 342,
    distance: '1.2 miles',
    priceRange: '$$',
    isOpen: true,
    address: '123 Hidden Lane, Los Angeles, CA 90012',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    hours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '9:00 AM - 10:00 PM',
      sunday: '9:00 AM - 8:00 PM',
    },
    highlights: [
      'Instagram-worthy garden setting',
      'Locally sourced organic coffee',
      'Homemade pastries and desserts',
      'Quiet atmosphere perfect for dates',
      'Free WiFi available',
    ],
    tags: ['Date-Friendly', 'Instagram-Worthy', 'Pet-Friendly'],
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleSave = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (isSaved) {
      await removeFavorite(gem.id, 'hidden_gem');
      setIsSaved(false);
    } else {
      const favoriteItem: FavoriteItem = {
        id: gem.id,
        type: 'hidden_gem',
        title: gem.name,
        description: gem.description,
        image: gem.image,
        savedAt: new Date().toISOString(),
        data: gem,
      };
      await saveFavorite(favoriteItem);
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Share functionality
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image with Blur Fade */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: gem.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Blur fade gradient overlay */}
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
        
        {/* Floating Buttons (scroll with content) */}
        <SafeAreaView edges={['top']} style={styles.floatingHeader}>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleBack}
              activeOpacity={0.6}
            >
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
                <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
              </Svg>
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleSave}
                activeOpacity={0.6}
              >
                <Heart size={20} color={isSaved ? Colors.primary : Colors.text} variant={isSaved ? 'Bold' : 'Outline'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleShare}
                activeOpacity={0.6}
              >
                <Share size={20} color={Colors.text} variant="Outline" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Category Badge + Rating Row */}
        <View style={styles.categoryBadgeContainer}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.categoryBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.categoryText}>{gem.category}</Text>
          </LinearGradient>
          
          <View style={styles.ratingRow}>
            <Star1 size={16} color="#FFC107" variant="Bold" />
            <Text style={styles.rating}>{gem.rating}</Text>
            <Text style={styles.reviews}>({gem.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Title Only */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{gem.name}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={[styles.infoIconCircle, { backgroundColor: '#EF444410' }]}>
              <LocationIcon size={20} color="#EF4444" variant="Bold" />
            </View>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{gem.distance}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoIconCircle, { backgroundColor: '#3B82F610' }]}>
              <Clock size={20} color="#3B82F6" variant="Bold" />
            </View>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: gem.isOpen ? '#10B981' : Colors.error }]}>
              {gem.isOpen ? 'Open Now' : 'Closed'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoIconCircle, { backgroundColor: '#F59E0B10' }]}>
              <Text style={styles.priceIcon}>{gem.priceRange}</Text>
            </View>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>Moderate</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <DocumentText size={20} color={Colors.textSecondary} variant="Outline" />
            </View>
            <Text style={styles.sectionTitle}>About This Place</Text>
          </View>
          <Text style={styles.description}>{gem.description}</Text>
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Lamp size={20} color={Colors.textSecondary} variant="Outline" />
            </View>
            <Text style={styles.sectionTitle}>Highlights</Text>
          </View>
          {gem.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>

        {/* Map */}
        <LocationMap
          coordinates={gem.coordinates}
          title={gem.name}
          description={gem.address}
          height={300}
          showHeader={true}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Get Directions Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.directionsButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.directionsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Routing size={20} color={Colors.textWhite} variant="Bold" />
            <Text style={styles.directionsText}>Get Directions</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroContainer: {
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
  categoryBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
    textTransform: 'capitalize',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  infoSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  priceIcon: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: '#F59E0B',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
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
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  highlightText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  directionsButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  directionsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  directionsText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
