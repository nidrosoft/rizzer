/**
 * Rizz Settings
 * Manage Rizz AI preferences and history
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
import { Flash, MessageText, Trash, Archive } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function RizzSettings() {
  const router = useRouter();
  const [autoSave, setAutoSave] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

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
        <Text style={styles.headerTitle}>Rizz Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="AI Preferences">
          <ToggleItem
            icon={<Flash size={22} color={Colors.text} variant="Outline" />}
            label="Auto-Save Rizz Lines"
            description="Automatically save generated rizz"
            value={autoSave}
            onValueChange={setAutoSave}
          />
          <ToggleItem
            icon={<MessageText size={22} color={Colors.text} variant="Outline" />}
            label="Show Suggestions"
            description="Get AI suggestions while typing"
            value={showSuggestions}
            onValueChange={setShowSuggestions}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Manage Data">
          <SettingItem
            icon={<Archive size={22} color={Colors.text} variant="Outline" />}
            label="Archived Rizz"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Trash size={22} color={Colors.text} variant="Outline" />}
            label="Clear History"
            onPress={() => {}}
            danger
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
