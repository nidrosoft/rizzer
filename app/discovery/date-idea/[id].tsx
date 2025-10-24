/**
 * Date Idea Detail Page - Refactored
 * Clean orchestration of date idea components
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Share as RNShare } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveFavorite, removeFavorite, isFavorited } from '@/utils/favoritesStorage';
import { FavoriteItem } from '@/types/favorites';
import { addDateToCalendar } from '@/utils/calendarUtils';
import { LA_LOCATIONS } from '@/utils/locationUtils';
import {
  DateIdeaHeader,
  DateIdeaInfo,
  DateIdeaDetails,
  DateIdeaLocation,
  DateIdeaActions,
} from '@/components/discovery/date-idea';

export default function DateIdeaDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);

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

  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    const saved = await isFavorited(dateIdea.id, 'date_idea');
    setIsSaved(saved);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
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
    try {
      await RNShare.share({
        message: `Check out this date idea: ${dateIdea.title}\n\n${dateIdea.description}\n\nEstimated cost: ${dateIdea.estimatedCost}`,
        title: dateIdea.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handlePlanDate = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    startDate.setHours(18, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(21, 0, 0, 0);
    
    await addDateToCalendar(
      dateIdea.title,
      startDate,
      endDate,
      dateIdea.address,
      dateIdea.description
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DateIdeaHeader
          imageUrl={dateIdea.image}
          isSaved={isSaved}
          onBack={handleBack}
          onSave={handleSave}
          onShare={handleShare}
        />

        <DateIdeaInfo
          category={dateIdea.category}
          rating={dateIdea.rating}
          reviewCount={dateIdea.reviewCount}
          title={dateIdea.title}
          duration={dateIdea.duration}
          estimatedCost={dateIdea.estimatedCost}
          difficulty={dateIdea.difficulty}
        />

        <DateIdeaDetails
          description={dateIdea.description}
          matchReason={dateIdea.matchReason}
          whatToBring={dateIdea.whatToBring}
          tips={dateIdea.tips}
        />

        <DateIdeaLocation
          location={dateIdea.location}
          address={dateIdea.address}
          coordinates={LA_LOCATIONS.griffithPark}
          tags={dateIdea.tags}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <DateIdeaActions onPlanDate={handlePlanDate} />
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
});
