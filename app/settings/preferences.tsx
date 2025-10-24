/**
 * App Preferences Settings
 * Customize app behavior and defaults
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
import { Setting2, Notification, Location, Microphone } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function PreferencesSettings() {
  const router = useRouter();
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

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
        <Text style={styles.headerTitle}>App Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="General">
          <ToggleItem
            icon={<Notification size={22} color={Colors.text} variant="Outline" />}
            label="Haptic Feedback"
            description="Vibrate on interactions"
            value={hapticFeedback}
            onValueChange={setHapticFeedback}
          />
          <ToggleItem
            icon={<Microphone size={22} color={Colors.text} variant="Outline" />}
            label="Sound Effects"
            description="Play sounds for actions"
            value={soundEffects}
            onValueChange={setSoundEffects}
          />
          <ToggleItem
            icon={<Location size={22} color={Colors.text} variant="Outline" />}
            label="Location Services"
            description="Enable location-based features"
            value={locationServices}
            onValueChange={setLocationServices}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Defaults">
          <SettingItem
            icon={<Setting2 size={22} color={Colors.text} variant="Outline" />}
            label="Default Date Duration"
            onPress={() => {}}
            badge="2 hours"
          />
          <SettingItem
            icon={<Setting2 size={22} color={Colors.text} variant="Outline" />}
            label="Default Budget"
            onPress={() => {}}
            badge="$50-100"
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
