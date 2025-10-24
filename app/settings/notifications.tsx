/**
 * Notifications Settings Page
 * Manage all notification preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import ToggleItem from '@/components/settings/ToggleItem';
import { 
  Notification,
  MessageText1,
  Heart,
  Calendar,
  Gift,
  Star1,
  Flash,
  Discover,
} from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function NotificationsSettings() {
  const router = useRouter();
  
  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  // Feature notifications
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [matchesNotif, setMatchesNotif] = useState(true);
  const [datesNotif, setDatesNotif] = useState(true);
  const [giftsNotif, setGiftsNotif] = useState(true);
  const [rizzNotif, setRizzNotif] = useState(true);
  const [eventsNotif, setEventsNotif] = useState(true);
  
  // Marketing
  const [promotionsNotif, setPromotionsNotif] = useState(false);
  const [tipsNotif, setTipsNotif] = useState(true);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Notification Channels */}
        <SettingSection title="Notification Channels">
          <ToggleItem
            icon={<Notification size={22} color={Colors.text} variant="Outline" />}
            label="Push Notifications"
            description="Receive notifications on your device"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <ToggleItem
            icon={<MessageText1 size={22} color={Colors.text} variant="Outline" />}
            label="Email Notifications"
            description="Receive updates via email"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <ToggleItem
            icon={<MessageText1 size={22} color={Colors.text} variant="Outline" />}
            label="SMS Notifications"
            description="Receive text messages for important updates"
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            showDivider={false}
          />
        </SettingSection>

        {/* Feature Notifications */}
        <SettingSection title="Feature Notifications">
          <ToggleItem
            icon={<MessageText1 size={22} color={Colors.text} variant="Outline" />}
            label="Messages"
            description="New messages and chat updates"
            value={messagesNotif}
            onValueChange={setMessagesNotif}
          />
          <ToggleItem
            icon={<Heart size={22} color={Colors.text} variant="Outline" />}
            label="Matches"
            description="New matches and profile views"
            value={matchesNotif}
            onValueChange={setMatchesNotif}
          />
          <ToggleItem
            icon={<Calendar size={22} color={Colors.text} variant="Outline" />}
            label="Dates"
            description="Date reminders and updates"
            value={datesNotif}
            onValueChange={setDatesNotif}
          />
          <ToggleItem
            icon={<Gift size={22} color={Colors.text} variant="Outline" />}
            label="Gift Investigations"
            description="Gift suggestions and investigation updates"
            value={giftsNotif}
            onValueChange={setGiftsNotif}
          />
          <ToggleItem
            icon={<Flash size={22} color={Colors.text} variant="Outline" />}
            label="Rizz Updates"
            description="New rizz lines and conversation starters"
            value={rizzNotif}
            onValueChange={setRizzNotif}
          />
          <ToggleItem
            icon={<Discover size={22} color={Colors.text} variant="Outline" />}
            label="Events & Discovery"
            description="New events and date ideas near you"
            value={eventsNotif}
            onValueChange={setEventsNotif}
            showDivider={false}
          />
        </SettingSection>

        {/* Marketing & Tips */}
        <SettingSection title="Marketing & Tips">
          <ToggleItem
            icon={<Star1 size={22} color={Colors.text} variant="Outline" />}
            label="Promotions & Offers"
            description="Special deals and subscription offers"
            value={promotionsNotif}
            onValueChange={setPromotionsNotif}
          />
          <ToggleItem
            icon={<MessageText1 size={22} color={Colors.text} variant="Outline" />}
            label="Dating Tips"
            description="Weekly tips and advice"
            value={tipsNotif}
            onValueChange={setTipsNotif}
            showDivider={false}
          />
        </SettingSection>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            You can manage your notification preferences at any time. Some notifications may still be sent for important account updates.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  infoText: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
    textAlign: 'center',
  },
});
