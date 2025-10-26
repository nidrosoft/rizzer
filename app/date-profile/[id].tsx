/**
 * Date Profile Screen
 * Main profile screen showing all information about a date
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Modal, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Archive, Trash } from 'iconsax-react-native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { getDateProfileById, archiveDateProfile, deleteDateProfile, addProfilePhoto, getProfilePhotos } from '@/lib/dateProfiles';
import { DateProfileData } from '@/types/dateProfile';
import { fetchFavorites, addFavorite, deleteFavorite, Favorite } from '@/lib/favorites';
import { uploadGalleryPhoto } from '@/lib/storage';
import { getMemories } from '@/lib/memories';
import { getGiftIdeas, getGiftHistory } from '@/lib/dateProfileGifts';

// Components
import ProfileHeader from '@/components/date-profile/ProfileHeader';
import CategoryGridCard from '@/components/date-profile/CategoryGridCard';
import InterestsCard from '@/components/date-profile/InterestsCardNew';
import FavoritesCard from '@/components/date-profile/FavoritesCard';
import QuickNotesCard from '@/components/date-profile/QuickNotesCard';
import PhotoGallery from '@/components/date-profile/PhotoGallery';
import EditPhotoModal from '@/components/date-profile/EditPhotoModal';
import UpdateStatusModal from '@/components/date-profile/UpdateStatusModal';
import ErrorModal from '@/components/ui/ErrorModal';

// Data
import { getProfileCategories } from '@/data/dateProfileData';

export default function DateProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();
  
  // State
  const [profile, setProfile] = useState<DateProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [memoriesCount, setMemoriesCount] = useState(0);
  const [giftsCount, setGiftsCount] = useState(0);
  
  // Get categories and update counts from database
  const categories = getProfileCategories().map(cat => {
    if (cat.id === 'memories') return { ...cat, count: memoriesCount };
    if (cat.id === 'gifts') return { ...cat, count: giftsCount };
    return cat;
  });
  
  // Fetch profile data from database
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id || !id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { success, data, error: fetchError } = await getDateProfileById(id as string, user.id);
        
        if (success && data) {
          setProfile(data);
          setError(null);
          setShowErrorModal(false);
          
          // Fetch favorites, memories count, and gifts count for this profile
          loadFavorites(id as string);
          loadMemoriesCount(id as string);
          loadGiftsCount(id as string);
        } else {
          setError(fetchError || 'Failed to load profile');
          setShowErrorModal(true);
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
        setError(err.message);
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [id, user?.id]);
  
  // Load favorites from database
  const loadFavorites = async (profileId: string) => {
    try {
      setFavoritesLoading(true);
      const { success, data } = await fetchFavorites(profileId);
      
      if (success && data) {
        setFavorites(data);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Load memories count from database
  const loadMemoriesCount = async (profileId: string) => {
    try {
      const { success, memories } = await getMemories(profileId);
      
      if (success && memories) {
        setMemoriesCount(memories.length);
      }
    } catch (err) {
      console.error('Error loading memories count:', err);
    }
  };

  // Load gifts count from database
  const loadGiftsCount = async (profileId: string) => {
    try {
      const [ideasResult, historyResult] = await Promise.all([
        getGiftIdeas(profileId),
        getGiftHistory(profileId),
      ]);
      
      const ideasCount = ideasResult.success && ideasResult.data ? ideasResult.data.length : 0;
      const historyCount = historyResult.success && historyResult.data ? historyResult.data.length : 0;
      
      setGiftsCount(ideasCount + historyCount);
    } catch (err) {
      console.error('Error loading gifts count:', err);
    }
  };

  // State for modals
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Handlers
  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleDelete = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowDeleteModal(true), 300);
  };

  const handleArchive = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowArchiveModal(true), 300);
  };

  const confirmDelete = async () => {
    if (!profile?.id || !user?.id) return;
    
    try {
      const { success, error } = await deleteDateProfile(profile.id, user.id);
      
      if (success) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setShowDeleteModal(false);
        
        // Navigate back after short delay
        setTimeout(() => router.back(), 500);
      } else {
        console.error('Failed to delete profile:', error);
        // TODO: Show error toast
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
      // TODO: Show error toast
    }
  };

  const confirmArchive = async () => {
    if (!profile?.id || !user?.id) return;
    
    try {
      const { success, error } = await archiveDateProfile(profile.id, user.id);
      
      if (success) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setShowArchiveModal(false);
        
        // Navigate back after short delay
        setTimeout(() => router.back(), 500);
      } else {
        console.error('Failed to archive profile:', error);
        // TODO: Show error toast
      }
    } catch (err) {
      console.error('Error archiving profile:', err);
      // TODO: Show error toast
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to category detail screen
    router.push(`/date-profile/categories/${categoryId}?id=${id}`);
  };

  const handleEditInterests = () => {
    console.log('Edit interests');
    // TODO: Open interests edit modal
  };
  
  const handleAddFavorite = async (favorite: {id: string; icon: string; category: string; value: string}) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!profile?.id) return;
    
    try {
      // Save to database
      const { success, data } = await addFavorite({
        profile_id: profile.id,
        icon: favorite.icon,
        category: favorite.category,
        value: favorite.value,
      });
      
      if (success && data) {
        // Add to local state
        setFavorites([...favorites, data]);
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (err) {
      console.error('Error adding favorite:', err);
    }
  };
  
  const handleRemoveFavorite = async (favoriteId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      // Delete from database
      const { success } = await deleteFavorite(favoriteId);
      
      if (success) {
        // Remove from local state
        setFavorites(favorites.filter(f => f.id !== favoriteId));
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleAddPhoto = async (photoUris: string | string[]) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!profile?.id || !user?.id) return;
    
    const uris = Array.isArray(photoUris) ? photoUris : [photoUris];
    
    console.log('📸 [DateProfile] Add photos:', {
      count: uris.length,
      uris
    });
    
    try {
      // Get current photo count for order_index
      const currentPhotoCount = profile.photos.length;
      const uploadedUrls: string[] = [];
      
      // Upload all photos
      for (let i = 0; i < uris.length; i++) {
        const uri = uris[i];
        
        // Upload to Supabase Storage (preserves aspect ratio for gallery)
        const { success, url, error: uploadError } = await uploadGalleryPhoto(
          uri,
          user.id,
          profile.id
        );
        
        if (!success || !url) {
          console.error('Failed to upload photo:', uploadError);
          continue;
        }
        
        // Save to database
        const { success: dbSuccess, error: dbError } = await addProfilePhoto(
          profile.id,
          url,
          currentPhotoCount + i
        );
        
        if (!dbSuccess) {
          console.error('Failed to save photo to database:', dbError);
          continue;
        }
        
        uploadedUrls.push(url);
      }
      
      // Update local state once with all uploaded photos
      if (uploadedUrls.length > 0) {
        setProfile({
          ...profile,
          photos: [...profile.photos, ...uploadedUrls],
        });
        
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
      
      console.log('✅ Photos uploaded successfully:', uploadedUrls.length);
    } catch (err) {
      console.error('Error uploading photos:', err);
    }
  };

  const handlePhotoUpdated = (photoUri: string) => {
    if (!profile) return;
    
    // Update local state
    setProfile({
      ...profile,
      basicInfo: {
        ...profile.basicInfo,
        photo: photoUri,
      },
    });
    
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!profile) return;
    
    try {
      // Update database
      const { error } = await supabase
        .from('date_profiles')
        .update({ relationship_stage: newStatus })
        .eq('id', profile.id);

      if (error) throw error;

      // Update local state
      setProfile({
        ...profile,
        basicInfo: {
          ...profile.basicInfo,
          status: newStatus as any,
        },
      });

      // Show success toast
      showToast('Status updated!', 'success');

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleAddNote = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to Notes category (same as clicking Notes in the grid)
    router.push(`/date-profile/categories/notes?id=${id}`);
  };

  const handleEditNote = (noteId: string) => {
    console.log('Edit note:', noteId);
    // TODO: Open edit note modal
  };

  const handleViewPhoto = (photoIndex: number) => {
    console.log('View photo:', photoIndex);
    // TODO: Open photo viewer
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.purple} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Error state
  if (error || !profile) {
    // Convert technical error to user-friendly message
    let friendlyMessage = 'Profile not found';
    
    if (error) {
      if (error.includes('Network') || error.includes('network') || error.includes('fetch') || error.includes('TypeError')) {
        friendlyMessage = "You're not connected to the internet. Please check your connection and try again.";
      } else if (error.includes('timeout')) {
        friendlyMessage = "The request is taking too long. Please check your connection and try again.";
      } else {
        friendlyMessage = "We're having trouble loading this profile. Please try again.";
      }
    }
    
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{friendlyMessage}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.6}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
            <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleEdit} activeOpacity={0.6}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <G clipPath="url(#clip0_4418_7499)">
              <Path d="M5 14.75C3.48 14.75 2.25 13.52 2.25 12C2.25 10.48 3.48 9.25 5 9.25C6.52 9.25 7.75 10.48 7.75 12C7.75 13.52 6.52 14.75 5 14.75ZM5 10.75C4.31 10.75 3.75 11.31 3.75 12C3.75 12.69 4.31 13.25 5 13.25C5.69 13.25 6.25 12.69 6.25 12C6.25 11.31 5.69 10.75 5 10.75Z" fill={Colors.text}/>
              <Path d="M19 14.75C17.48 14.75 16.25 13.52 16.25 12C16.25 10.48 17.48 9.25 19 9.25C20.52 9.25 21.75 10.48 21.75 12C21.75 13.52 20.52 14.75 19 14.75ZM19 10.75C18.31 10.75 17.75 11.31 17.75 12C17.75 12.69 18.31 13.25 19 13.25C19.69 13.25 20.25 12.69 20.25 12C20.25 11.31 19.69 10.75 19 10.75Z" fill={Colors.text}/>
              <Path d="M12 14.75C10.48 14.75 9.25 13.52 9.25 12C9.25 10.48 10.48 9.25 12 9.25C13.52 9.25 14.75 10.48 14.75 12C14.75 13.52 13.52 14.75 12 14.75ZM12 10.75C11.31 10.75 10.75 11.31 10.75 12C10.75 12.69 11.31 13.25 12 13.25C12.69 13.25 13.25 12.69 13.25 12C13.25 11.31 12.69 10.75 12 10.75Z" fill={Colors.text}/>
            </G>
            <Defs>
              <ClipPath id="clip0_4418_7499">
                <Rect width="24" height="24" fill="white"/>
              </ClipPath>
            </Defs>
          </Svg>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <ProfileHeader 
          profile={profile} 
          onBack={handleBack} 
          onEdit={handleEdit}
          onEditPhoto={() => setShowEditPhoto(true)}
          onStatusUpdate={() => setShowUpdateStatus(true)}
        />

        {/* Content Container */}
        <View style={styles.content}>
          {/* Interests Card */}
          <InterestsCard interests={profile.interests} onEdit={handleEditInterests} />
          
          {/* Favorites Card */}
          <FavoritesCard
            favorites={favorites}
            onAdd={handleAddFavorite}
            onRemove={handleRemoveFavorite}
          />

          {/* Quick Notes Card */}
          <QuickNotesCard
            profileId={profile.id}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
          />

          {/* Photo Gallery */}
          <PhotoGallery
            photos={profile.photos}
            onAddPhoto={handleAddPhoto}
            onViewPhoto={handleViewPhoto}
          />

          {/* Category Grid */}
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <CategoryGridCard
                key={category.id}
                category={category}
                onPress={handleCategoryPress}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Action Sheet */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <TouchableOpacity
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowActionSheet(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Profile Options</Text>
            
            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={handleArchive}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconContainer, { backgroundColor: `${Colors.purple}15` }]}>
                <Archive size={22} color={Colors.purple} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={styles.actionSheetOptionText}>Archive Profile</Text>
                <Text style={styles.actionSheetOptionSubtext}>Move to archives</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionSheetDivider} />

            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconContainer, { backgroundColor: '#FFE5E5' }]}>
                <Trash size={22} color="#FF4444" variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={[styles.actionSheetOptionText, { color: '#FF4444' }]}>Delete Profile</Text>
                <Text style={styles.actionSheetOptionSubtext}>Remove permanently</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteModalIcon}>
              <Trash size={24} color="#FF4444" variant="Bold" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete this profile?</Text>
            <Text style={styles.deleteModalMessage}>
              Once deleted, all information about {profile.basicInfo.name} will be permanently removed.
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.deleteButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.deleteButtonText}>Yes, delete</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        visible={showArchiveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowArchiveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteModalIcon}>
              <Archive size={24} color={Colors.purple} variant="Bold" />
            </View>
            <Text style={styles.deleteModalTitle}>Archive this profile?</Text>
            <Text style={styles.deleteModalMessage}>
              {profile.basicInfo.name}'s profile will be moved to archives. You can restore it anytime.
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmArchive}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.deleteButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.deleteButtonText}>Yes, archive</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowArchiveModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Photo Modal */}
      <EditPhotoModal
        visible={showEditPhoto}
        onClose={() => setShowEditPhoto(false)}
        currentPhoto={profile.basicInfo.photo}
        onPhotoUpdated={handlePhotoUpdated}
        profileId={profile.id}
        profileName={profile.basicInfo.name}
        userId={user?.id || ''}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        visible={showUpdateStatus}
        onClose={() => setShowUpdateStatus(false)}
        currentStatus={profile.basicInfo.status}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          router.back();
        }}
        onRetry={async () => {
          if (!user?.id || !id) return;
          
          setShowErrorModal(false);
          setIsLoading(true);
          
          try {
            const { success, data, error: fetchError } = await getDateProfileById(id as string, user.id);
            
            if (success && data) {
              setProfile(data);
              setError(null);
              loadFavorites(id as string);
              loadMemoriesCount(id as string);
              loadGiftsCount(id as string);
            } else {
              setError(fetchError || 'Failed to load profile');
              setShowErrorModal(true);
            }
          } catch (err: any) {
            console.error('Error loading profile:', err);
            setError(err.message);
            setShowErrorModal(true);
          } finally {
            setIsLoading(false);
          }
        }}
        title="Connection Issue"
        message={error?.includes('Network') || error?.includes('network') || error?.includes('fetch') 
          ? "Unable to load profile. Please check your internet connection and try again."
          : "Unable to load profile data. Please try again."}
        showRetry={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: '#FAFAFA',
    zIndex: 100,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionSheetTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  actionSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  actionSheetIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionSheetTextContainer: {
    flex: 1,
  },
  actionSheetOptionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  actionSheetOptionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  actionSheetDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.xl,
  },
  deleteModal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    maxWidth: 340,
    width: '85%',
    position: 'relative',
  },
  deleteModalIcon: {
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
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    lineHeight: 28,
  },
  deleteModalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  deleteButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  deleteButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
});
