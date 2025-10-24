/**
 * Settings Screen
 * App settings and preferences organized by categories
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import BackButton from '@/components/ui/BackButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { 
  ArrowRight2,
  Crown,
  Star1,
  Wallet2,
  Login,
  Shield,
  DocumentText,
  Notification,
  Moon,
  Global,
  InfoCircle,
  MessageQuestion,
  LogoutCurve,
  Flash,
  MessageText1,
  Calendar,
  Gift,
  Discover,
  Heart,
  Setting2,
  Profile2User,
  Danger
} from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteFeedback, setDeleteFeedback] = useState('');

  const deleteReasons = [
    'I met someone',
    'App is too expensive',
    'Not getting matches',
    'Privacy concerns',
    'Technical issues',
    'Other',
  ];

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleNavigation = (route: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Navigate to:', route);
    // TODO: Implement navigation to sub-pages
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
    console.log('User logged out');
    router.replace('/phone-entry');
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    if (!deleteReason) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDeleteModal(false);
    // TODO: Implement actual account deletion
    console.log('Account deleted:', { reason: deleteReason, feedback: deleteFeedback });
    router.replace('/phone-entry');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Section */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('subscription')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Crown size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Subscription / Plan</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('profile')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Profile2User size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>My Profile</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('payment')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Wallet2 size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Payment Method</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.categoryTitle}>Features</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('rizz')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Flash size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Rizz Settings</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('dates')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Calendar size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Dates Management</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('gifts')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Gift size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Gift Investigations</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('discovery')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Discover size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Discovery & Events</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('ai-chat')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <MessageText1 size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>AI Chat History</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.categoryTitle}>Settings</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('login')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Login size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Login & Password</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('privacy')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Shield size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Privacy Settings</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('notifications')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Notification size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('preferences')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Setting2 size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>App Preferences</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('terms')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <DocumentText size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Terms & Conditions</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <LogoutCurve size={22} color={Colors.error} variant="Outline" />
                <Text style={[styles.settingLabel, { color: Colors.error }]}>Delete Account</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.error} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.categoryTitle}>Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('appearance')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Moon size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Appearance</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('language')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Global size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('interests')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Heart size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Interests & Hobbies</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.categoryTitle}>About</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('about')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <InfoCircle size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>About App</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('help')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <MessageQuestion size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Help & Support</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleNavigation('feedback')}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Star1 size={22} color={Colors.text} variant="Outline" />
                <Text style={styles.settingLabel}>Rate & Feedback</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.cardContainer}>
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

      {/* Delete Account Modal - iOS Bottom Sheet */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <TouchableOpacity 
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDeleteModal(false);
            setDeleteReason('');
            setDeleteConfirmText('');
            setDeleteFeedback('');
          }}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.bottomSheetContent}>
                <View style={styles.deleteIconContainer}>
                  <Danger size={32} color={Colors.error} variant="Bold" />
                </View>
                <Text style={styles.bottomSheetTitle}>Delete Account</Text>
                <Text style={styles.bottomSheetMessage}>
                  We're sorry to see you go. This action cannot be undone and all your data will be permanently deleted.
                </Text>

                {/* Reason Selection */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Why are you leaving? *</Text>
                  <View style={styles.reasonsContainer}>
                    {deleteReasons.map((reason) => (
                      <TouchableOpacity
                        key={reason}
                        style={[
                          styles.reasonChip,
                          deleteReason === reason && styles.reasonChipSelected,
                        ]}
                        onPress={() => setDeleteReason(reason)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.reasonText,
                            deleteReason === reason && styles.reasonTextSelected,
                          ]}
                        >
                          {reason}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Feedback */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Additional feedback (optional)</Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Tell us more about your experience..."
                    placeholderTextColor={Colors.textSecondary}
                    value={deleteFeedback}
                    onChangeText={setDeleteFeedback}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Confirmation */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>
                    Type <Text style={styles.deleteHighlight}>DELETE</Text> to confirm *
                  </Text>
                  <TextInput
                    style={styles.confirmInput}
                    placeholder="Type DELETE"
                    placeholderTextColor={Colors.textSecondary}
                    value={deleteConfirmText}
                    onChangeText={setDeleteConfirmText}
                    autoCapitalize="characters"
                  />
                </View>

                <TouchableOpacity 
                  style={[
                    styles.deleteAccountButton,
                    (!deleteReason || deleteConfirmText.toLowerCase() !== 'delete') &&
                      styles.deleteAccountButtonDisabled,
                  ]}
                  onPress={confirmDelete}
                  activeOpacity={0.8}
                  disabled={!deleteReason || deleteConfirmText.toLowerCase() !== 'delete'}
                >
                  <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelDeleteButton}
                  onPress={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                    setDeleteConfirmText('');
                    setDeleteFeedback('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelDeleteButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
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
  backButton: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
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
  cardContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginLeft: Spacing.lg + 22 + Spacing.md,
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
    fontSize: FontSizes.md,
    color: Colors.error,
    fontWeight: FontWeights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  logoutModal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bottomSheetContent: {
    padding: Spacing.xl,
    paddingTop: 0,
  },
  deleteIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  bottomSheetTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  bottomSheetMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  primaryButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  deleteHighlight: {
    color: Colors.error,
    fontWeight: FontWeights.bold,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  reasonChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  reasonChipSelected: {
    backgroundColor: `${Colors.error}10`,
    borderColor: Colors.error,
  },
  reasonText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  reasonTextSelected: {
    color: Colors.error,
    fontWeight: FontWeights.semibold,
  },
  feedbackInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.lg,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 120,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  confirmInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.lg,
    fontSize: FontSizes.md,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    fontWeight: FontWeights.semibold,
  },
  deleteAccountButton: {
    width: '100%',
    paddingVertical: Spacing.md + 4,
    borderRadius: 12,
    backgroundColor: Colors.error,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  deleteAccountButtonDisabled: {
    backgroundColor: Colors.borderLight,
    opacity: 0.5,
  },
  deleteAccountButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelDeleteButton: {
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
  },
  cancelDeleteButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
