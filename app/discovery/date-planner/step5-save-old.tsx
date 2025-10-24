/**
 * AI Date Planner - Step 5: Save & Share
 * Save the itinerary and share with date partner
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Calendar from 'expo-calendar';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path } from 'react-native-svg';
import { Heart, Share, Calendar as CalendarIcon, Location as LocationIcon, TickCircle } from 'iconsax-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { getMockItinerary } from '@/data/mockDateItineraries';
import ShareSheet from '@/components/social/ShareSheet';
import { formatShareMessage, generateShareLink } from '@/utils/enhancedShare';

export default function Step5Save() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const itinerary = getMockItinerary();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const confettiRef = useRef<any>(null);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleSaveAction = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: Save to user's plans
    setCompletedActions(prev => [...prev, 'save']);
  };

  const handleShareAction = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowShareSheet(true);
    setCompletedActions(prev => [...prev, 'share']);
  };

  const handleCalendarAction = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow calendar access to add your date plan.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get default calendar
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on your device.');
        return;
      }

      // Create calendar event for the date
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // Set to next week
      startDate.setHours(18, 0, 0, 0); // 6:00 PM

      const endDate = new Date(startDate);
      endDate.setHours(22, 0, 0, 0); // 10:00 PM

      // Create main event
      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: itinerary.title,
        startDate,
        endDate,
        notes: `${itinerary.activities.length} activities planned:\n\n${itinerary.activities.map((a, i) => `${i + 1}. ${a.time} - ${a.title}\n   ${a.location}`).join('\n\n')}`,
        alarms: [
          { relativeOffset: -60 * 24 }, // 1 day before
          { relativeOffset: -60 * 2 },  // 2 hours before
        ],
      });

      if (eventId) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert(
          'Added to Calendar! 📅',
          `"${itinerary.title}" has been added to your calendar with reminders.`,
          [{ text: 'Great!' }]
        );
        setCompletedActions(prev => [...prev, 'calendar']);
      }
    } catch (error) {
      console.error('Calendar error:', error);
      Alert.alert('Error', 'Could not add to calendar. Please try again.');
    }
  };

  const handleDirectionsAction = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      // Get first activity location
      const firstActivity = itinerary.activities[0];
      const location = firstActivity.location;
      
      // Encode location for URL
      const encodedLocation = encodeURIComponent(location);
      
      // Try different map apps based on platform
      let mapUrl = '';
      
      if (Platform.OS === 'ios') {
        // Try Apple Maps first
        mapUrl = `maps://maps.apple.com/?q=${encodedLocation}`;
        
        const canOpen = await Linking.canOpenURL(mapUrl);
        if (!canOpen) {
          // Fallback to Google Maps
          mapUrl = `comgooglemaps://?q=${encodedLocation}`;
          const canOpenGoogle = await Linking.canOpenURL(mapUrl);
          if (!canOpenGoogle) {
            // Fallback to web Google Maps
            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
          }
        }
      } else {
        // Android - try Google Maps
        mapUrl = `geo:0,0?q=${encodedLocation}`;
      }
      
      await Linking.openURL(mapUrl);
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setCompletedActions(prev => [...prev, 'directions']);
    } catch (error) {
      console.error('Maps error:', error);
      Alert.alert(
        'Could Not Open Maps',
        'Please make sure you have a maps app installed.',
        [{ text: 'OK' }]
      );
    }
  };

  const triggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  };

  const handleShare = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowShareSheet(true);
  };

  const handleComplete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setShowSuccessModal(true);
    
    // Trigger confetti animation
    triggerConfetti();
    
    // Auto-navigate back to discovery after 2.5 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push('/tabs/discovery');
    }, 2500);
  };

  const actions = [
    {
      id: 'save',
      icon: Heart,
      title: 'Save to My Plans',
      description: 'Access anytime from your saved dates',
      color: '#FF6B6B',
      action: handleSaveAction,
    },
    {
      id: 'share',
      icon: Share,
      title: 'Share with Date',
      description: 'Send itinerary via message or email',
      color: '#4ECDC4',
      action: handleShareAction,
    },
    {
      id: 'calendar',
      icon: CalendarIcon,
      title: 'Add to Calendar',
      description: 'Set reminders for each activity',
      color: '#A78BFA',
      action: handleCalendarAction,
    },
    {
      id: 'directions',
      icon: LocationIcon,
      title: 'Get Directions',
      description: 'Open in Maps for navigation',
      color: '#FCA5A5',
      action: handleDirectionsAction,
    },
  ];

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
          <Text style={styles.headerTitle}>Save Your Plan</Text>
          <Text style={styles.headerSubtitle}>Step 5 of 5</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={[styles.progressFill, { width: '100%' }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎉</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Your Date Plan is Ready!</Text>
        <Text style={styles.subtitle}>
          {itinerary.title} • {itinerary.activities.length} activities
        </Text>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          {actions.map((action) => {
            const Icon = action.icon;
            const isCompleted = completedActions.includes(action.id);
            
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, isCompleted && styles.actionCardCompleted]}
                onPress={action.action}
                activeOpacity={0.7}
                disabled={isCompleted}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Icon size={24} color={isCompleted ? Colors.textSecondary : action.color} variant="Bold" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionTitle, isCompleted && styles.actionTitleCompleted]}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                {isCompleted ? (
                  <TickCircle size={28} color="#10B981" variant="Bold" />
                ) : (
                  <View style={styles.actionArrow}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke={Colors.textSecondary} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can always access your saved date plans from the Discovery tab
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.completeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.completeText}>Complete</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Confetti */}
      {showSuccessModal && (
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={3000}
        />
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.modalIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TickCircle size={48} color={Colors.textWhite} variant="Bold" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Date Plan Saved!</Text>
            <Text style={styles.modalMessage}>
              Your perfect date is ready to go. Have an amazing time! 💕
            </Text>
          </View>
        </View>
      </Modal>

      {/* Share Sheet */}
      <ShareSheet
        visible={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        content={{
          title: itinerary.title,
          message: formatShareMessage('date_plan', {
            title: itinerary.title,
            date: itinerary.date,
            activities: itinerary.activities.map(a => `${a.time} - ${a.title}`),
          }),
          url: generateShareLink('date-plan', '1'),
          image: '💕',
        }}
      />
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
    fontSize: FontSizes.lg,
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
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  actionsSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardCompleted: {
    borderColor: Colors.borderLight,
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  actionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  actionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  actionArrow: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    width: '100%',
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  completeButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  completeGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
