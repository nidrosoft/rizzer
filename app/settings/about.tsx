/**
 * About App Settings
 * App information and details
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import { InfoCircle, Code, Global, Instagram, Facebook } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function AboutSettings() {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleWebsite = () => {
    Linking.openURL('https://rizzers.app');
  };

  const handleInstagram = () => {
    Linking.openURL('https://instagram.com/rizzersapp');
  };

  const handleFacebook = () => {
    Linking.openURL('https://facebook.com/rizzersapp');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>About App</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="App Information">
          <SettingItem
            icon={<InfoCircle size={22} color={Colors.text} variant="Outline" />}
            label="Version"
            onPress={() => {}}
            badge="1.0.0"
          />
          <SettingItem
            icon={<Code size={22} color={Colors.text} variant="Outline" />}
            label="Build Number"
            onPress={() => {}}
            badge="100"
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Connect With Us">
          <SettingItem
            icon={<Global size={22} color={Colors.text} variant="Outline" />}
            label="Website"
            onPress={handleWebsite}
          />
          <SettingItem
            icon={<Instagram size={22} color={Colors.text} variant="Outline" />}
            label="Instagram"
            onPress={handleInstagram}
          />
          <SettingItem
            icon={<Facebook size={22} color={Colors.text} variant="Outline" />}
            label="Facebook"
            onPress={handleFacebook}
            showDivider={false}
          />
        </SettingSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💜 by Rizzers Team</Text>
          <Text style={styles.copyright}>© 2024 Rizzers. All rights reserved.</Text>
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
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  footerText: {
    fontSize: normalize(14),
    color: Colors.text,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  copyright: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
  },
});
