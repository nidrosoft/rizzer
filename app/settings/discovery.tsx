/**
 * Discovery & Events Settings
 * Manage discovery and event preferences
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
import { Discover, Location, Notification, Category } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function DiscoverySettings() {
  const router = useRouter();
  const [showNearby, setShowNearby] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(true);

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
        <Text style={styles.headerTitle}>Discovery & Events</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="Event Discovery">
          <ToggleItem
            icon={<Discover size={22} color={Colors.text} variant="Outline" />}
            label="Show Nearby Events"
            description="Discover events around you"
            value={showNearby}
            onValueChange={setShowNearby}
          />
          <ToggleItem
            icon={<Notification size={22} color={Colors.text} variant="Outline" />}
            label="Event Notifications"
            description="Get notified about new events"
            value={eventNotifications}
            onValueChange={setEventNotifications}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Preferences">
          <SettingItem
            icon={<Location size={22} color={Colors.text} variant="Outline" />}
            label="Search Radius"
            onPress={() => {}}
            badge="10 miles"
          />
          <SettingItem
            icon={<Category size={22} color={Colors.text} variant="Outline" />}
            label="Event Categories"
            onPress={() => {}}
            badge="All"
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
