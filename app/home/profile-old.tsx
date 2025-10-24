/**
 * Profile Screen
 * User profile page with account settings access
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Setting2, ArrowRight2, Edit2, CloseCircle, User, Sms, Call, Location } from 'iconsax-react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import Toast from '@/components/Toast';
import BackButton from '@/components/ui/BackButton';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Steven',
    email: 'steven@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  });
  const [editedData, setEditedData] = useState(profileData);
  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const memberSince = 'October 2024';

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    router.push('/home/settings');
  };

  const handleEditProfile = () => {
    setEditedData(profileData);
    setHasChanges(false);
    setShowEditSheet(true);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Check if any changes were made
    const changed = Object.keys(profileData).some(
      key => editedData[key as keyof typeof profileData] !== profileData[key as keyof typeof profileData]
    );
    setHasChanges(changed || value !== profileData[field as keyof typeof profileData]);
  };

  const handleSaveChanges = () => {
    // Validate all fields
    if (!editedData.fullName.trim() || !editedData.email.trim() || 
        !editedData.phone.trim() || !editedData.location.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setProfileData(editedData);
    setShowEditSheet(false);
    setHasChanges(false);
    // Show success toast
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleSettings}
          activeOpacity={0.7}
        >
          <Setting2 size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.profileBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileInner}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={styles.profilePicture}
              />
            </View>
          </LinearGradient>
          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          <View style={styles.memberBadge}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.memberBadgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.memberBadgeText}>Member since {memberSince}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Profile Info Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <Edit2 size={20} color={Colors.text} variant="Outline" />
            </TouchableOpacity>
          </View>
          <View style={styles.groupCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <User size={22} color={Colors.text} variant="Outline" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{profileData.fullName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Sms size={22} color={Colors.text} variant="Outline" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profileData.email}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Call size={22} color={Colors.text} variant="Outline" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profileData.phone}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <Location size={22} color={Colors.text} variant="Outline" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{profileData.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.section, styles.actionsSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.groupCard}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionLeft}>
                <Text style={styles.actionIcon}>✏️</Text>
                <Text style={styles.actionText}>Edit Profile</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionLeft}>
                <Text style={styles.actionIcon}>🔒</Text>
                <Text style={styles.actionText}>Change Password</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionLeft}>
                <Text style={styles.actionIcon}>🔔</Text>
                <Text style={styles.actionText}>Notification Preferences</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => router.push('/favorites')}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <Text style={styles.actionIcon}>💝</Text>
                <Text style={styles.actionText}>My Favorites</Text>
              </View>
              <ArrowRight2 size={20} color={Colors.textSecondary} variant="Outline" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Bottom Sheet */}
      <Modal
        visible={showEditSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditSheet(false)}
      >
        <TouchableOpacity 
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowEditSheet(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditSheet(false)}
              activeOpacity={0.7}
            >
              <CloseCircle size={28} color={Colors.text} variant="Bold" />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.bottomSheetContent}>
                <Text style={styles.bottomSheetTitle}>Edit Profile</Text>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editedData.fullName}
                    onChangeText={(text) => handleFieldChange('fullName', text)}
                    placeholder="First name"
                    placeholderTextColor={Colors.textLight}
                    autoCapitalize="words"
                  />
                  <View style={styles.underline} />
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={editedData.email}
                    onChangeText={(text) => handleFieldChange('email', text)}
                    placeholder="email@example.com"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.underline} />
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    value={editedData.phone}
                    onChangeText={(text) => handleFieldChange('phone', text)}
                    placeholder="+1 (555) 123-4567"
                    placeholderTextColor={Colors.textLight}
                    keyboardType="phone-pad"
                  />
                  <View style={styles.underline} />
                </View>

                {/* Location */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={editedData.location}
                    onChangeText={(text) => handleFieldChange('location', text)}
                    placeholder="City, State"
                    placeholderTextColor={Colors.textLight}
                  />
                  <View style={styles.underline} />
                </View>

                <TouchableOpacity 
                  style={[
                    styles.saveChangesButton,
                    !hasChanges && styles.saveChangesButtonDisabled,
                  ]}
                  onPress={handleSaveChanges}
                  activeOpacity={0.8}
                  disabled={!hasChanges}
                >
                  <LinearGradient
                    colors={hasChanges ? [Colors.gradientStart, Colors.gradientEnd] : [Colors.borderLight, Colors.borderLight]}
                    style={styles.saveChangesGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.saveChangesText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Toast */}
      <Toast visible={showToast} message={toastMessage} onHide={() => setShowToast(false)} />
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
    backgroundColor: '#F1F1F1',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    paddingBottom: Spacing.xxl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  profileBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
    ...Shadows.medium,
  },
  profileInner: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  profileName: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  profileEmail: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  memberBadge: {
    marginTop: Spacing.md,
  },
  memberBadgeGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 9999,
  },
  memberBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionsSection: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupCard: {
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
  infoItem: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginLeft: Spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  actionIcon: {
    fontSize: 22,
  },
  actionText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
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
    maxHeight: '85%',
    position: 'relative',
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  bottomSheetTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.xs,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveChangesButton: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  saveChangesButtonDisabled: {
    opacity: 0.5,
  },
  saveChangesGradient: {
    paddingVertical: Spacing.md + 4,
    alignItems: 'center',
  },
  saveChangesText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
