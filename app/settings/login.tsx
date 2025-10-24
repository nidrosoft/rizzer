/**
 * Login & Password Settings
 * Manage login credentials and security
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
import { Lock, Sms, Shield, Key } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function LoginSettings() {
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleToggleTwoFactor = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleToggleBiometric = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setBiometricEnabled(!biometricEnabled);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Login & Password</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SettingSection title="Account Security">
          <SettingItem
            icon={<Lock size={22} color={Colors.text} variant="Outline" />}
            label="Change Password"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Sms size={22} color={Colors.text} variant="Outline" />}
            label="Change Email"
            onPress={() => {}}
            badge="steven@example.com"
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Two-Factor Authentication">
          <ToggleItem
            icon={<Shield size={22} color={Colors.text} variant="Outline" />}
            label="Enable 2FA"
            description="Add an extra layer of security"
            value={twoFactorEnabled}
            onValueChange={handleToggleTwoFactor}
            showDivider={false}
          />
        </SettingSection>

        <SettingSection title="Biometric Security">
          <ToggleItem
            icon={<Key size={22} color={Colors.text} variant="Outline" />}
            label="Face ID / Touch ID"
            description="Use biometrics to unlock app"
            value={biometricEnabled}
            onValueChange={handleToggleBiometric}
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
