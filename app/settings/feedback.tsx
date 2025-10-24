/**
 * Rate & Feedback Settings
 * Provide feedback and rate the app
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import { Star1, MessageEdit, Share, Heart } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function FeedbackSettings() {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleRateApp = () => {
    // Open App Store or Play Store
    const storeUrl = Platform.OS === 'ios'
      ? 'https://apps.apple.com/app/rizzers'
      : 'https://play.google.com/store/apps/details?id=com.rizzers';
    Linking.openURL(storeUrl);
  };

  const handleShare = () => {
    // Share app functionality
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Rate & Feedback</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.loveBox}>
          <Text style={styles.loveEmoji}>💜</Text>
          <Text style={styles.loveTitle}>Enjoying Rizzers?</Text>
          <Text style={styles.loveText}>
            Your feedback helps us improve and reach more people!
          </Text>
        </View>

        <SettingSection title="Rate Us">
          <SettingItem
            icon={<Star1 size={22} color={Colors.text} variant="Outline" />}
            label="Rate on App Store"
            onPress={handleRateApp}
          />
          <SettingItem
            icon={<Star1 size={22} color={Colors.text} variant="Outline" />}
            label="Rate on Play Store"
            onPress={handleRateApp}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Feedback">
          <SettingItem
            icon={<MessageEdit size={22} color={Colors.text} variant="Outline" />}
            label="Send Feedback"
            onPress={() => {}}
          />
          <SettingItem
            icon={<MessageEdit size={22} color={Colors.text} variant="Outline" />}
            label="Suggest a Feature"
            onPress={() => {}}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Share">
          <SettingItem
            icon={<Share size={22} color={Colors.text} variant="Outline" />}
            label="Share Rizzers"
            onPress={handleShare}
          />
          <SettingItem
            icon={<Heart size={22} color={Colors.text} variant="Outline" />}
            label="Tell a Friend"
            onPress={handleShare}
            showDivider={false}
          />
        </SettingSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for being part of the Rizzers community! 🎉
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
  loveBox: {
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loveEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  loveTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  loveText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: normalize(20),
  },
  footer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: `${Colors.purple}10`,
    borderRadius: 12,
  },
  footerText: {
    fontSize: normalize(14),
    color: Colors.text,
    textAlign: 'center',
    fontWeight: FontWeights.medium,
  },
});
