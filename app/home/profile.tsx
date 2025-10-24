/**
 * Profile Screen - Refactored
 * Clean orchestration of profile components
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Setting2 } from 'iconsax-react-native';
import Toast from '@/components/Toast';
import BackButton from '@/components/ui/BackButton';
import {
  ProfileHeader,
  ProfileInfoCard,
  QuickActionsCard,
  EditProfileSheet,
} from '@/components/profile';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

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
    const changed = Object.keys(profileData).some(
      key => editedData[key as keyof typeof profileData] !== profileData[key as keyof typeof profileData]
    );
    setHasChanges(changed || value !== profileData[field as keyof typeof profileData]);
  };

  const handleSaveChanges = () => {
    setProfileData(editedData);
    setShowEditSheet(false);
    setHasChanges(false);
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFavorites = () => {
    router.push('/favorites');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <ProfileHeader
          name={profileData.fullName}
          email={profileData.email}
          memberSince={memberSince}
        />

        <ProfileInfoCard
          data={profileData}
          onEdit={handleEditProfile}
        />

        <QuickActionsCard
          onFavoritesPress={handleFavorites}
        />
      </ScrollView>

      <EditProfileSheet
        visible={showEditSheet}
        data={editedData}
        hasChanges={hasChanges}
        onClose={() => setShowEditSheet(false)}
        onFieldChange={handleFieldChange}
        onSave={handleSaveChanges}
      />

      <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    paddingBottom: Spacing.xxl,
  },
});
