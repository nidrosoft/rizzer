/**
 * Archived Profiles Screen
 * Displays all archived date profiles with restore functionality
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Archive, ArrowRotateLeft } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { fetchArchivedProfiles, restoreDateProfile } from '@/lib/dateProfiles';
import BackButton from '@/components/ui/BackButton';

interface ArchivedProfile {
  id: string;
  name: string;
  age: number;
  photo: string | null;
  status: string;
  archivedAt: string;
}

export default function ArchivedProfilesScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [profiles, setProfiles] = useState<ArchivedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ArchivedProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadArchivedProfiles();
  }, []);

  const loadArchivedProfiles = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const { success, data } = await fetchArchivedProfiles(user.id);
      
      if (success && data) {
        setProfiles(data);
      }
    } catch (err) {
      console.error('Error loading archived profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleProfilePress = (profile: ArchivedProfile) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedProfile(profile);
    setShowRestoreModal(true);
  };

  const handleRestore = async () => {
    if (!selectedProfile || !user?.id) return;
    
    try {
      setIsRestoring(true);
      const { success, error } = await restoreDateProfile(selectedProfile.id, user.id);
      
      if (success) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Remove from list
        setProfiles(profiles.filter(p => p.id !== selectedProfile.id));
        setShowRestoreModal(false);
        setSelectedProfile(null);
      } else {
        console.error('Failed to restore profile:', error);
        // TODO: Show error toast
      }
    } catch (err) {
      console.error('Error restoring profile:', err);
      // TODO: Show error toast
    } finally {
      setIsRestoring(false);
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Archived Profiles</Text>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.purple} />
          <Text style={styles.loadingText}>Loading archived profiles...</Text>
        </View>
      ) : profiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Archive size={64} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.emptyTitle}>No Archived Profiles</Text>
          <Text style={styles.emptyText}>
            Profiles you archive will appear here.{'\n'}
            You can restore them anytime.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.profileCard}
              onPress={() => handleProfilePress(profile)}
              activeOpacity={0.7}
            >
              {/* Profile Photo */}
              <View style={styles.photoContainer}>
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.photoBorder}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.photoInner}>
                    <Image
                      source={{ uri: profile.photo || placeholderImage }}
                      style={styles.photo}
                    />
                  </View>
                </LinearGradient>
              </View>

              {/* Profile Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {profile.name}, {profile.age}
                </Text>
                <Text style={styles.profileStatus}>
                  Archived • {new Date(profile.archivedAt).toLocaleDateString()}
                </Text>
              </View>

              {/* Restore Icon */}
              <View style={styles.restoreIcon}>
                <ArrowRotateLeft size={20} color={Colors.purple} variant="Outline" />
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Restore Confirmation Modal */}
      <Modal
        visible={showRestoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isRestoring && setShowRestoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.restoreModal}>
            <View style={styles.restoreModalIcon}>
              <ArrowRotateLeft size={24} color={Colors.purple} variant="Bold" />
            </View>
            <Text style={styles.restoreModalTitle}>Restore this profile?</Text>
            <Text style={styles.restoreModalMessage}>
              {selectedProfile?.name}'s profile will be restored and moved back to your active profiles.
            </Text>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              activeOpacity={0.8}
              disabled={isRestoring}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.restoreButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isRestoring ? (
                  <ActivityIndicator size="small" color={Colors.textWhite} />
                ) : (
                  <Text style={styles.restoreButtonText}>Yes, restore</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRestoreModal(false)}
              activeOpacity={0.7}
              disabled={isRestoring}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  placeholder: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    marginRight: Spacing.md,
  },
  photoBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
  },
  photoInner: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  restoreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.purple}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreModal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    maxWidth: 340,
    width: '85%',
    position: 'relative',
  },
  restoreModalIcon: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  restoreModalTitle: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    lineHeight: 28,
  },
  restoreModalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  restoreButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  restoreButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
