/**
 * Date Idea Detail Page
 * Full details for a specific date idea with save and share functionality
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Share as RNShare, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path } from 'react-native-svg';
import { Heart, Share, Clock, DollarCircle, Location, Star1, Calendar } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { saveFavorite, removeFavorite, isFavorited } from '@/utils/favoritesStorage';
import { FavoriteItem } from '@/types/favorites';
import { addDateToCalendar } from '@/utils/calendarUtils';
import { LA_LOCATIONS } from '@/utils/locationUtils';
import LocationMap from '@/components/maps/LocationMap';

export default function DateIdeaDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    const saved = await isFavorited(dateIdea.id, 'date_idea');
    setIsSaved(saved);
  };

  // Mock data - in real app, fetch by ID
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id || '1';
  const dateIdea = {
    id: itemId,
    title: 'Sunset Picnic at Griffith Park',
    description: 'Watch the sunset with a gourmet picnic basket and stunning city views. This romantic outdoor experience combines nature, food, and breathtaking scenery for an unforgettable date.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    category: 'Romantic',
    difficulty: 'Easy',
    budget: '$$',
    duration: '2-3 hours',
    bestTime: 'Evening',
    isIndoor: false,
    matchReason: 'Sarah loves nature and photography',
    tags: ['Outdoor', 'Romantic', 'Photo-worthy'],
    estimatedCost: '$40-60',
    whatToBring: [
      'Picnic blanket',
      'Sunscreen',
      'Camera for photos',
      'Light jacket for evening',
      'Portable speaker (optional)',
    ],
    tips: [
      'Arrive 1 hour before sunset for best lighting',
      'Book a picnic basket from a local vendor',
      'Bring a portable charger for your phone',
      'Check weather forecast beforehand',
    ],
    location: 'Griffith Park, Los Angeles',
    address: '4730 Crystal Springs Dr, Los Angeles, CA 90027',
    rating: 4.8,
    reviewCount: 342,
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
      await removeFavorite(dateIdea.id, 'date_idea');
      setIsSaved(false);
    } else {
      const favoriteItem: FavoriteItem = {
        id: dateIdea.id,
        type: 'date_idea',
        title: dateIdea.title,
        description: dateIdea.description,
        image: '🌅',
        savedAt: new Date().toISOString(),
        data: dateIdea,
      };
      await saveFavorite(favoriteItem);
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      await RNShare.share({
        message: `Check out this date idea: ${dateIdea.title}\n\n${dateIdea.description}\n\nEstimated cost: ${dateIdea.estimatedCost}`,
        title: dateIdea.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookNow = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Add to calendar
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Next week
    startDate.setHours(18, 0, 0, 0); // 6 PM
    
    const endDate = new Date(startDate);
    endDate.setHours(21, 0, 0, 0); // 9 PM
    
    await addDateToCalendar(
      dateIdea.title,
      startDate,
      endDate,
      dateIdea.address,
      dateIdea.description
    );
  };

  const getBudgetIcon = (budget: string) => {
    switch (budget) {
      case '$': return '💰';
      case '$$': return '💵';
      case '$$$': return '💎';
      default: return '💰';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Moderate': return '#FFA500';
      case 'Hard': return '#F44336';
      default: return Colors.textSecondary;
    }
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
            source={{ uri: dateIdea.image }}
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
            <Text style={styles.categoryText}>{dateIdea.category}</Text>
          </LinearGradient>
          
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {dateIdea.rating}</Text>
            <Text style={styles.reviews}>({dateIdea.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Title Only */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{dateIdea.title}</Text>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoSection}>
          <View style={styles.infoCard}>
            <Clock size={20} color={Colors.purple} variant="Bold" />
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{dateIdea.duration}</Text>
          </View>
          <View style={styles.infoCard}>
            <DollarCircle size={20} color={Colors.purple} variant="Bold" />
            <Text style={styles.infoLabel}>Budget</Text>
            <Text style={styles.infoValue}>{dateIdea.estimatedCost}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.difficultyIcon}>🎯</Text>
            <Text style={styles.infoLabel}>Difficulty</Text>
            <Text style={[styles.infoValue, { color: getDifficultyColor(dateIdea.difficulty) }]}>
              {dateIdea.difficulty}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Date</Text>
          <Text style={styles.description}>{dateIdea.description}</Text>
        </View>

        {/* Match Reason */}
        <View style={styles.matchCard}>
          <Text style={styles.matchIcon}>✨</Text>
          <View style={styles.matchContent}>
            <Text style={styles.matchTitle}>Why This Works</Text>
            <Text style={styles.matchReason}>{dateIdea.matchReason}</Text>
          </View>
        </View>

        {/* What to Bring */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Bring</Text>
          {dateIdea.whatToBring.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pro Tips</Text>
          {dateIdea.tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <Location size={20} color={Colors.purple} variant="Bold" />
            <View style={styles.locationContent}>
              <Text style={styles.locationName}>{dateIdea.location}</Text>
              <Text style={styles.locationAddress}>{dateIdea.address}</Text>
            </View>
          </View>
        </View>

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Map</Text>
          <LocationMap
            coordinates={LA_LOCATIONS.griffithPark}
            title={dateIdea.location}
            description={dateIdea.address}
            height={250}
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {dateIdea.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Calendar size={20} color={Colors.textWhite} variant="Bold" />
            <Text style={styles.bookText}>Plan This Date</Text>
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
  titleSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  oldTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  quickInfoSection: {
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  difficultyIcon: {
    fontSize: 20,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: `${Colors.purple}10`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: `${Colors.purple}30`,
  },
  matchIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  matchContent: {
    flex: 1,
  },
  matchTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
    marginBottom: 4,
  },
  matchReason: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  bullet: {
    fontSize: FontSizes.md,
    color: Colors.purple,
    marginRight: Spacing.sm,
    fontWeight: FontWeights.bold,
  },
  listText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
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
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
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
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bookButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  bookGradient: {
    flexDirection: 'row',
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  bookText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
