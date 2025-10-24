/**
 * Dates Management Settings
 * Manage date-related preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import ToggleItem from '@/components/settings/ToggleItem';
import { Calendar, Notification, Cloud, Clock } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function DatesSettings() {
  const router = useRouter();
  const [autoCalendar, setAutoCalendar] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [autoReminders, setAutoReminders] = useState(true);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Dates Management</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="Calendar Integration">
          <ToggleItem
            icon={<Calendar size={22} color={Colors.text} variant="Outline" />}
            label="Auto-Create Events"
            description="Add dates to your calendar automatically"
            value={autoCalendar}
            onValueChange={setAutoCalendar}
          />
          <ToggleItem
            icon={<Notification size={22} color={Colors.text} variant="Outline" />}
            label="Auto Reminders"
            description="Get notified before your dates"
            value={autoReminders}
            onValueChange={setAutoReminders}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Date Preferences">
          <ToggleItem
            icon={<Cloud size={22} color={Colors.text} variant="Outline" />}
            label="Show Weather Info"
            description="Display weather for date locations"
            value={showWeather}
            onValueChange={setShowWeather}
          />
          <SettingItem
            icon={<Clock size={22} color={Colors.text} variant="Outline" />}
            label="Default Reminder Time"
            onPress={() => {}}
            badge="1 hour before"
          />
          <SettingItem
            icon={<Calendar size={22} color={Colors.text} variant="Outline" />}
            label="History Retention"
            onPress={() => {}}
            badge="6 months"
            showDivider={false}
          />
        </SettingSection>
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
});
