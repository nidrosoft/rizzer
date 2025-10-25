/**
 * Settings Screen - Refactored
 * Clean orchestration of setting sections
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SettingSection from '@/components/settings/SettingSection';
import SettingItem from '@/components/settings/SettingItem';
import { useAuthStore } from '@/store/authStore';
import { deleteUserAccount } from '@/lib/accountDeletion';
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
  Trash,
  Warning2,
} from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      Alert.alert('Invalid Input', 'Please type "DELETE" to confirm account deletion.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please try again.');
      return;
    }

    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    setIsDeleting(true);

    try {
      // Delete all user data and account
      const result = await deleteUserAccount(user.id);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete account');
      }
      
      setShowDeleteModal(false);
      setDeleteConfirmText('');
      
      Alert.alert(
        'Account Deleted',
        'Your account and all associated data have been permanently deleted.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/phone-entry'),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
      console.error('Delete account error:', error);
    } finally {
      setIsDeleting(false);
    }
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

        {/* Danger Zone */}
        <SettingSection title="Danger Zone">
          <SettingItem
            icon={<Trash size={22} color={Colors.error} variant="Outline" />}
            label="Delete Account"
            onPress={handleDeleteAccount}
            danger={true}
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

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconContainer}>
              <Warning2 size={48} color={Colors.error} variant="Bold" />
            </View>
            
            <Text style={styles.deleteModalTitle}>Delete Account?</Text>
            <Text style={styles.deleteModalMessage}>
              This action is permanent and cannot be undone. All your data, including:
            </Text>
            
            <View style={styles.deleteListContainer}>
              <Text style={styles.deleteListItem}>• Profile information</Text>
              <Text style={styles.deleteListItem}>• Date profiles</Text>
              <Text style={styles.deleteListItem}>• Photos and media</Text>
              <Text style={styles.deleteListItem}>• Rizz library</Text>
              <Text style={styles.deleteListItem}>• Chat history</Text>
              <Text style={styles.deleteListItem}>• All other account data</Text>
            </View>
            
            <Text style={styles.deleteModalWarning}>
              will be permanently deleted.
            </Text>
            
            <Text style={styles.deleteModalInstruction}>
              Type <Text style={styles.deleteKeyword}>DELETE</Text> to confirm:
            </Text>
            
            <TextInput
              style={styles.deleteInput}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder="Type DELETE here"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="characters"
              editable={!isDeleting}
            />
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.deleteCancelButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.deleteModalButton,
                  styles.deleteConfirmButton,
                  (deleteConfirmText.toLowerCase() !== 'delete' || isDeleting) && styles.deleteConfirmButtonDisabled,
                ]}
                onPress={confirmDeleteAccount}
                disabled={deleteConfirmText.toLowerCase() !== 'delete' || isDeleting}
                activeOpacity={0.7}
              >
                {isDeleting ? (
                  <ActivityIndicator color={Colors.background} />
                ) : (
                  <Text style={styles.deleteConfirmText}>Delete Forever</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  deleteModalContent: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  deleteModalTitle: {
    fontSize: normalize(24),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  deleteModalMessage: {
    fontSize: normalize(15),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  deleteListContainer: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  deleteListItem: {
    fontSize: normalize(14),
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  deleteModalWarning: {
    fontSize: normalize(15),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: FontWeights.semibold,
  },
  deleteModalInstruction: {
    fontSize: normalize(15),
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  deleteKeyword: {
    fontWeight: FontWeights.bold,
    color: Colors.error,
  },
  deleteInput: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: normalize(16),
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: FontWeights.semibold,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelButton: {
    backgroundColor: Colors.backgroundGray,
  },
  deleteCancelText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  deleteConfirmButton: {
    backgroundColor: Colors.error,
  },
  deleteConfirmButtonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  deleteConfirmText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.background,
  },
});
