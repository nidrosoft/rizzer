/**
 * Help & Support Settings
 * Access help resources and support
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import { MessageQuestion, Sms, Call, Messages3, DocumentText } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function HelpSettings() {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@rizzers.app');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+1-555-RIZZERS');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeTitle}>How can we help?</Text>
          <Text style={styles.welcomeText}>
            We're here to assist you with any questions or issues you may have
          </Text>
        </View>

        <SettingSection title="Get Help">
          <SettingItem
            icon={<MessageQuestion size={22} color={Colors.text} variant="Outline" />}
            label="FAQs"
            onPress={() => {}}
          />
          <SettingItem
            icon={<DocumentText size={22} color={Colors.text} variant="Outline" />}
            label="User Guide"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Messages3 size={22} color={Colors.text} variant="Outline" />}
            label="Live Chat"
            onPress={() => {}}
            badge="Online"
            badgeColor={Colors.success}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Contact Us">
          <SettingItem
            icon={<Sms size={22} color={Colors.text} variant="Outline" />}
            label="Email Support"
            onPress={handleEmail}
            badge="support@rizzers.app"
          />
          <SettingItem
            icon={<Call size={22} color={Colors.text} variant="Outline" />}
            label="Phone Support"
            onPress={handlePhone}
            badge="+1-555-RIZZERS"
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Report Issues">
          <SettingItem
            icon={<MessageQuestion size={22} color={Colors.text} variant="Outline" />}
            label="Report a Bug"
            onPress={() => {}}
          />
          <SettingItem
            icon={<MessageQuestion size={22} color={Colors.text} variant="Outline" />}
            label="Request a Feature"
            onPress={() => {}}
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
  welcomeBox: {
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    lineHeight: normalize(20),
  },
});
