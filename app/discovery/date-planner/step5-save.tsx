/**
 * AI Date Planner - Step 5: Save & Share - Refactored
 * Clean orchestration of save components
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Calendar from 'expo-calendar';
import { Heart, Share, Calendar as CalendarIcon, Location as LocationIcon } from 'iconsax-react-native';
import { getMockItinerary } from '@/data/mockDateItineraries';
import ShareSheet from '@/components/social/ShareSheet';
import { formatShareMessage, generateShareLink } from '@/utils/enhancedShare';
import {
  SaveHeader,
  SuccessSection,
  ActionsList,
  SuccessModal,
  CompleteButton,
} from '@/components/discovery/date-planner/step5';
import { Spacing } from '@/constants/theme';

export default function Step5Save() {
  const router = useRouter();
  const itinerary = getMockItinerary();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSaveAction = () => {
    // TODO: Save to user's plans
    setCompletedActions(prev => [...prev, 'save']);
  };

  const handleShareAction = () => {
    setShowShareSheet(true);
    setCompletedActions(prev => [...prev, 'share']);
  };

  const handleCalendarAction = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow calendar access to add your date plan.',
          [{ text: 'OK' }]
        );
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on your device.');
        return;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      startDate.setHours(18, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(22, 0, 0, 0);

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: itinerary.title,
        startDate,
        endDate,
        notes: `${itinerary.activities.length} activities planned:\n\n${itinerary.activities.map((a, i) => `${i + 1}. ${a.time} - ${a.title}\n   ${a.location}`).join('\n\n')}`,
        alarms: [
          { relativeOffset: -60 * 24 },
          { relativeOffset: -60 * 2 },
        ],
      });

      if (eventId) {
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
    try {
      const firstActivity = itinerary.activities[0];
      const location = firstActivity.location;
      const encodedLocation = encodeURIComponent(location);
      
      let mapUrl = '';
      
      if (Platform.OS === 'ios') {
        mapUrl = `maps://maps.apple.com/?q=${encodedLocation}`;
        const canOpen = await Linking.canOpenURL(mapUrl);
        if (!canOpen) {
          mapUrl = `comgooglemaps://?q=${encodedLocation}`;
          const canOpenGoogle = await Linking.canOpenURL(mapUrl);
          if (!canOpenGoogle) {
            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
          }
        }
      } else {
        mapUrl = `geo:0,0?q=${encodedLocation}`;
      }
      
      await Linking.openURL(mapUrl);
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

  const handleComplete = () => {
    setShowSuccessModal(true);
    
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
      <SaveHeader onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SuccessSection
          title={itinerary.title}
          activityCount={itinerary.activities.length}
        />

        <ActionsList
          actions={actions}
          completedActions={completedActions}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can always access your saved date plans from the Discovery tab
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <CompleteButton onPress={handleComplete} />

      <SuccessModal visible={showSuccessModal} />

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.md,
    width: '100%',
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
