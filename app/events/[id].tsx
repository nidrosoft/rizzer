/**
 * Event Detail Page
 * Full event information with RSVP functionality
 * Composed of micro-modular components
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { Heart, Share, Calendar, Location as LocationIcon, DollarCircle, Clock } from 'iconsax-react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { RSVPStatus } from '@/types/events';
import { getEventById } from '@/data/mockEventsDetailed';
import { saveRSVP, getRSVP } from '@/utils/rsvpStorage';
import { addEventToCalendar } from '@/utils/calendarUtils';
import { saveFavorite, removeFavorite, isFavorited } from '@/utils/favoritesStorage';
import LocationMap from '@/components/maps/LocationMap';

// Micro components
import EventHero from '@/components/events/EventHero';
import EventTitle from '@/components/events/EventTitle';
import EventInfoCard from '@/components/events/EventInfoCard';
import EventDescription from '@/components/events/EventDescription';
import EventHighlights from '@/components/events/EventHighlights';
import ShareSheet from '@/components/social/ShareSheet';
import { formatShareMessage, generateShareLink } from '@/utils/enhancedShare';

export default function EventDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id || '1';
  
  const event = getEventById(eventId);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(null);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  useEffect(() => {
    loadRSVP();
    checkIfSaved();
  }, []);

  const loadRSVP = async () => {
    const rsvp = await getRSVP(eventId);
    if (rsvp) {
      setRsvpStatus(rsvp.status);
    }
  };

  const checkIfSaved = async () => {
    const saved = await isFavorited(eventId, 'event');
    setIsSaved(saved);
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
      await removeFavorite(eventId, 'event');
      setIsSaved(false);
    } else {
      await saveFavorite({
        id: eventId,
        type: 'event',
        title: event?.title || '',
        description: event?.description,
        image: event?.image,
        savedAt: new Date().toISOString(),
        data: event,
      });
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowShareSheet(true);
  };

  const handleRSVPChange = async (status: RSVPStatus) => {
    await saveRSVP(eventId, status, true);
    setRsvpStatus(status);
    setShowRSVPModal(true);
  };

  const handleAddToCalendar = async () => {
    if (!event) return;
    
    const eventDate = new Date(event.date);
    const [startHour, startMin] = event.startTime.split(':');
    const [endHour, endMin] = event.endTime.split(':');
    
    const startDate = new Date(eventDate);
    startDate.setHours(parseInt(startHour), parseInt(startMin));
    
    const endDate = new Date(eventDate);
    endDate.setHours(parseInt(endHour), parseInt(endMin));
    
    await addEventToCalendar(
      event.title,
      startDate,
      endDate,
      event.location.address,
      event.description
    );
    
    setShowRSVPModal(false);
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Event not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatPrice = () => {
    if (event.price.isFree) return 'Free';
    if (event.price.min === event.price.max) return `$${event.price.min}`;
    return `$${event.price.min} - $${event.price.max}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Image with Blur Fade */}
        <EventHero image={event.image} category={event.category} />
        
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
            <Text style={styles.categoryText}>{event.category}</Text>
          </LinearGradient>
          
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {event.rating}</Text>
            <Text style={styles.reviews}>({event.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Title Only */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{event.title}</Text>
        </View>
        
        {/* Info Cards with Colorful Icons */}
        <View style={styles.infoSection}>
          <EventInfoCard
            icon={<Calendar size={22} color={Colors.purple} variant="Bold" />}
            label="Date & Time"
            value={formatDate(event.date)}
            subValue={`${event.startTime} - ${event.endTime}`}
            iconColor={Colors.purple}
          />
          <EventInfoCard
            icon={<LocationIcon size={22} color="#3B82F6" variant="Bold" />}
            label="Location"
            value={event.location.name}
            subValue={event.location.address}
            iconColor="#3B82F6"
          />
          <EventInfoCard
            icon={<DollarCircle size={22} color="#F59E0B" variant="Bold" />}
            label="Price"
            value={formatPrice()}
            iconColor="#F59E0B"
          />
          <EventInfoCard
            icon={<Clock size={22} color="#10B981" variant="Bold" />}
            label="Host"
            value={event.host.name}
            subValue={event.host.verified ? '✓ Verified' : ''}
            iconColor="#10B981"
          />
        </View>

        <EventDescription description={event.description} tags={event.tags} />
        <EventHighlights highlights={event.highlights} />
        
        {/* Map with Header */}
        <LocationMap
          coordinates={event.location.coordinates}
          title={event.location.name}
          description={event.location.address}
          height={300}
          showHeader={true}
        />
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Share Sheet */}
      <ShareSheet
        visible={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        content={{
          title: event.title,
          message: formatShareMessage('event', {
            title: event.title,
            date: formatDate(event.date),
            startTime: event.startTime,
            location: event.location.name,
          }),
          url: generateShareLink('event', event.id),
          image: event.image,
        }}
      />
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
    paddingHorizontal: Spacing.lg,
  },
});
