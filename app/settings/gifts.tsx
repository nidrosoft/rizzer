/**
 * Gift Investigations Settings
 * Manage gift investigation preferences
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
import { Gift, MessageText, Wallet2, Global, Clock } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function GiftsSettings() {
  const router = useRouter();
  const [autoPause, setAutoPause] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);

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
        <Text style={styles.headerTitle}>Gift Investigations</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="Investigation Settings">
          <ToggleItem
            icon={<MessageText size={22} color={Colors.text} variant="Outline" />}
            label="Auto-Pause"
            description="Pause after 20 messages"
            value={autoPause}
            onValueChange={setAutoPause}
          />
          <ToggleItem
            icon={<Gift size={22} color={Colors.text} variant="Outline" />}
            label="Save History"
            description="Keep investigation records"
            value={saveHistory}
            onValueChange={setSaveHistory}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Defaults">
          <SettingItem
            icon={<Wallet2 size={22} color={Colors.text} variant="Outline" />}
            label="Default Budget"
            onPress={() => {}}
            badge="$50-100"
          />
          <SettingItem
            icon={<Global size={22} color={Colors.text} variant="Outline" />}
            label="Default Language"
            onPress={() => {}}
            badge="English"
          />
          <SettingItem
            icon={<Clock size={22} color={Colors.text} variant="Outline" />}
            label="History Retention"
            onPress={() => {}}
            badge="3 months"
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
