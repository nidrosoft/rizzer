/**
 * Privacy Settings Page
 * Manage privacy and data preferences
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import ToggleItem from '@/components/settings/ToggleItem';
import { 
  Shield,
  Eye,
  EyeSlash,
  Location,
  Profile2User,
  MessageText1,
  Lock,
  Trash,
  DocumentDownload,
  Danger,
} from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function PrivacySettings() {
  const router = useRouter();
  
  // Privacy states
  const [profileVisible, setProfileVisible] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleDownloadData = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      'Download Your Data',
      'We\'ll prepare a copy of your data and send it to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request', onPress: () => console.log('Data download requested') },
      ]
    );
  };

  const handleDeleteData = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your data including messages, matches, and profile information. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Data deletion requested') 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Privacy */}
        <SettingSection title="Profile Privacy">
          <ToggleItem
            icon={<Eye size={22} color={Colors.text} variant="Outline" />}
            label="Profile Visible"
            description="Allow others to see your profile"
            value={profileVisible}
            onValueChange={setProfileVisible}
          />
          <ToggleItem
            icon={<Profile2User size={22} color={Colors.text} variant="Outline" />}
            label="Show Online Status"
            description="Let others know when you're online"
            value={showOnlineStatus}
            onValueChange={setShowOnlineStatus}
          />
          <ToggleItem
            icon={<Location size={22} color={Colors.text} variant="Outline" />}
            label="Show Location"
            description="Display your approximate location"
            value={showLocation}
            onValueChange={setShowLocation}
          />
          <ToggleItem
            icon={<EyeSlash size={22} color={Colors.text} variant="Outline" />}
            label="Show Last Seen"
            description="Display when you were last active"
            value={showLastSeen}
            onValueChange={setShowLastSeen}
            showDivider={false}
          />
        </SettingSection>

        {/* Communication Privacy */}
        <SettingSection title="Communication">
          <ToggleItem
            icon={<MessageText1 size={22} color={Colors.text} variant="Outline" />}
            label="Allow Messages"
            description="Receive messages from matches"
            value={allowMessages}
            onValueChange={setAllowMessages}
          />
          <SettingItem
            icon={<Lock size={22} color={Colors.text} variant="Outline" />}
            label="Blocked Users"
            onPress={() => router.push('/settings/blocked-users')}
            showDivider={false}
          />
        </SettingSection>

        {/* Data & Analytics */}
        <SettingSection title="Data & Analytics">
          <ToggleItem
            icon={<Shield size={22} color={Colors.text} variant="Outline" />}
            label="Share Analytics"
            description="Help us improve the app with usage data"
            value={shareAnalytics}
            onValueChange={setShareAnalytics}
          />
          <SettingItem
            icon={<DocumentDownload size={22} color={Colors.text} variant="Outline" />}
            label="Download My Data"
            onPress={handleDownloadData}
            showDivider={false}
          />
        </SettingSection>

        {/* Danger Zone */}
        <SettingSection title="Danger Zone">
          <SettingItem
            icon={<Trash size={22} color={Colors.error} variant="Outline" />}
            label="Delete All Data"
            onPress={handleDeleteData}
            danger
            showDivider={false}
          />
        </SettingSection>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your privacy is important to us. We use industry-standard encryption to protect your data. Read our{' '}
            <Text style={styles.link}>Privacy Policy</Text> for more information.
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
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  infoText: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
    textAlign: 'center',
  },
  link: {
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
    textDecorationLine: 'underline',
  },
});
