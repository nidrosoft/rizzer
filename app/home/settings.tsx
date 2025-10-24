/**
 * Settings Screen - Refactored
 * Clean orchestration of setting sections
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import { 
  Crown,
  Profile2User,
  Wallet2,
  Flash,
  Calendar,
  Gift,
  Discover,
  MessageText1,
  Login,
  Shield,
  Notification,
  Setting2,
  DocumentText,
  Moon,
  Global,
  Heart,
  InfoCircle,
  MessageQuestion,
  Star1,
  LogoutCurve,
} from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function SettingsScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleLogout = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowLogoutModal(false);
    // TODO: Implement actual logout
    router.replace('/phone-entry');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Section */}
        <SettingSection>
          <SettingItem
            icon={<Crown size={22} color={Colors.text} variant="Outline" />}
            label="Subscription / Plan"
            onPress={() => router.push('/settings/subscription')}
            badge="PRO"
            badgeColor={Colors.purple}
          />
          <SettingItem
            icon={<Profile2User size={22} color={Colors.text} variant="Outline" />}
            label="My Profile"
            onPress={() => router.push('/settings/profile')}
          />
          <SettingItem
            icon={<Wallet2 size={22} color={Colors.text} variant="Outline" />}
            label="Payment Method"
            onPress={() => router.push('/settings/payment')}
            showDivider={false}
          />
        </SettingSection>

        {/* Features Section */}
        <SettingSection title="Features">
          <SettingItem
            icon={<Flash size={22} color={Colors.text} variant="Outline" />}
            label="Rizz Settings"
            onPress={() => router.push('/settings/rizz')}
          />
          <SettingItem
            icon={<Calendar size={22} color={Colors.text} variant="Outline" />}
            label="Dates Management"
            onPress={() => router.push('/settings/dates')}
          />
          <SettingItem
            icon={<Gift size={22} color={Colors.text} variant="Outline" />}
            label="Gift Investigations"
            onPress={() => router.push('/settings/gifts')}
          />
          <SettingItem
            icon={<Discover size={22} color={Colors.text} variant="Outline" />}
            label="Discovery & Events"
            onPress={() => router.push('/settings/discovery')}
          />
          <SettingItem
            icon={<MessageText1 size={22} color={Colors.text} variant="Outline" />}
            label="AI Chat History"
            onPress={() => router.push('/settings/ai-chat')}
            showDivider={false}
          />
        </SettingSection>

        {/* Settings Section */}
        <SettingSection title="Settings">
          <SettingItem
            icon={<Login size={22} color={Colors.text} variant="Outline" />}
            label="Login & Password"
            onPress={() => router.push('/settings/login')}
          />
          <SettingItem
            icon={<Shield size={22} color={Colors.text} variant="Outline" />}
            label="Privacy Settings"
            onPress={() => router.push('/settings/privacy')}
          />
          <SettingItem
            icon={<Notification size={22} color={Colors.text} variant="Outline" />}
            label="Notifications"
            onPress={() => router.push('/settings/notifications')}
          />
          <SettingItem
            icon={<Setting2 size={22} color={Colors.text} variant="Outline" />}
            label="App Preferences"
            onPress={() => router.push('/settings/preferences')}
          />
          <SettingItem
            icon={<DocumentText size={22} color={Colors.text} variant="Outline" />}
            label="Terms & Conditions"
            onPress={() => router.push('/settings/terms')}
            showDivider={false}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            icon={<Moon size={22} color={Colors.text} variant="Outline" />}
            label="Appearance"
            onPress={() => router.push('/settings/appearance')}
          />
          <SettingItem
            icon={<Global size={22} color={Colors.text} variant="Outline" />}
            label="Language"
            onPress={() => router.push('/settings/language')}
            badge="EN"
          />
          <SettingItem
            icon={<Heart size={22} color={Colors.text} variant="Outline" />}
            label="Interests & Hobbies"
            onPress={() => router.push('/settings/interests')}
            showDivider={false}
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <SettingItem
            icon={<InfoCircle size={22} color={Colors.text} variant="Outline" />}
            label="About App"
            onPress={() => router.push('/settings/about')}
          />
          <SettingItem
            icon={<MessageQuestion size={22} color={Colors.text} variant="Outline" />}
            label="Help & Support"
            onPress={() => router.push('/settings/help')}
          />
          <SettingItem
            icon={<Star1 size={22} color={Colors.text} variant="Outline" />}
            label="Rate & Feedback"
            onPress={() => router.push('/settings/feedback')}
            showDivider={false}
          />
        </SettingSection>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <LogoutCurve size={22} color={Colors.error} variant="Bold" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        icon={<LogoutCurve size={28} color={Colors.textWhite} variant="Bold" />}
        title="Log Out"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmText="Yes, log out"
        cancelText="Cancel"
        iconBackgroundColor={Colors.error}
      />
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
  logoutContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logoutText: {
    fontSize: normalize(16),
    color: Colors.error,
    fontWeight: FontWeights.semibold,
  },
});
