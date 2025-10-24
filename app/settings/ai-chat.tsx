/**
 * AI Chat History Settings
 * Manage AI conversation history
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
import { MessageText, DocumentDownload, Clock, Trash } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function AIChatSettings() {
  const router = useRouter();
  const [autoSave, setAutoSave] = useState(true);

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
        <Text style={styles.headerTitle}>AI Chat History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="Chat Settings">
          <ToggleItem
            icon={<MessageText size={22} color={Colors.text} variant="Outline" />}
            label="Auto-Save Conversations"
            description="Automatically save chat history"
            value={autoSave}
            onValueChange={setAutoSave}
          />
          <SettingItem
            icon={<Clock size={22} color={Colors.text} variant="Outline" />}
            label="Retention Period"
            onPress={() => {}}
            badge="3 months"
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Manage Data">
          <SettingItem
            icon={<DocumentDownload size={22} color={Colors.text} variant="Outline" />}
            label="Export Chat History"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Trash size={22} color={Colors.text} variant="Outline" />}
            label="Clear All History"
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
