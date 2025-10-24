import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Clipboard, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Copy, Star1, MagicStar, Home2, Trash } from 'iconsax-react-native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import Toast from '@/components/Toast';
import RizzLoadingCard from '@/components/rizz/RizzLoadingCard';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [savedRizzes, setSavedRizzes] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data - will be replaced with actual data based on category
  const categoryData = {
    title: 'Conversation Starters',
    description: 'My favorite collections of categories on asking her out in a funny way.',
    color: '#FF6B9D',
    icon: '😊',
    rizzes: [
      'My favorite collections of categories on Asking her out in a funny way.',
      'Are you a magician? Because whenever I look at you, everyone else disappears.',
      'Do you believe in love at first sight, or should I walk by again?',
      'If you were a vegetable, you\'d be a cute-cumber!',
      'Is your name Google? Because you have everything I\'ve been searching for.',
      'Do you have a map? I keep getting lost in your eyes.',
      // New longer examples
      'I was reading the book of Numbers last night, and I realized I don\'t have yours. Would you mind if we changed that? I promise I\'m not just trying to add you to my collection - you seem genuinely interesting.',
      'Excuse me, but I think you dropped something: my jaw.',
      'I\'m not a photographer, but I can definitely picture us together. And honestly, I think we\'d make a pretty amazing team. What do you think about grabbing coffee sometime and seeing if this chemistry is real or if I\'m just being optimistic?',
      'Are you French? Because Eiffel for you.',
      'If being beautiful was a crime, you\'d be serving a life sentence without parole. I\'d be your lawyer, but I don\'t think I could defend you - the evidence is just too overwhelming.',
      'Do you have a Band-Aid? Because I just scraped my knee falling for you, and I think I might need some medical attention. Or at least your phone number so we can discuss treatment options over dinner.',
    ],
  };

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleCopy = (text: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Clipboard.setString(text);
    setToastMessage('Copied to clipboard!');
    setToastType('info');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSave = (text: string, index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Toggle saved state
    setSavedRizzes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
        setToastMessage('Removed from collection!');
      } else {
        newSet.add(index);
        setToastMessage('Saved to collection!');
      }
      return newSet;
    });
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleRegenerate = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Start loading animation
    setIsGenerating(true);
    
    // Simulate AI generation (3 seconds)
    setTimeout(() => {
      setIsGenerating(false);
      // TODO: Add new rizzes to the list
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 3000);
  };

  const handleMoreOptions = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleAddToHome = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowActionSheet(false);
    // TODO: Add to home quick actions
    setToastMessage('Added to Home Quick Actions!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDeletePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowActionSheet(false);
    setTimeout(() => {
      setShowDeleteModal(true);
    }, 300);
  };

  const handleConfirmDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDeleteModal(false);
    // TODO: Delete category
    setToastMessage('Category deleted successfully');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const handleCancelDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowDeleteModal(false);
  };

  return (
    <LinearGradient
      colors={['#E6E9EB', '#FFFFFF']}
      style={styles.container}
      locations={[0, 1]}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.headerContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleBack}
            activeOpacity={0.6}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{categoryData.title}</Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleMoreOptions}
            activeOpacity={0.6}
          >
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

        {/* Category Description */}
        <View style={styles.headerContent}>
          <Text style={styles.description}>{categoryData.description}</Text>
        </View>
        </LinearGradient>

      {/* Rizz List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Loading cards when generating */}
        {isGenerating && (
          <>
            <RizzLoadingCard />
            <RizzLoadingCard />
            <RizzLoadingCard />
          </>
        )}
        
        {categoryData.rizzes.map((rizz, index) => {
          const isSaved = savedRizzes.has(index);
          return (
          <View key={index} style={styles.rizzCard}>
            <Text style={styles.rizzText}>{rizz}</Text>
            <View style={styles.rizzActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleSave(rizz, index)}
                activeOpacity={0.6}
              >
                {isSaved ? (
                  <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    style={styles.savedStarGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Star1 size={22} color={Colors.textWhite} variant="Bold" />
                  </LinearGradient>
                ) : (
                  <Star1 size={22} color={Colors.text} variant="Outline" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCopy(rizz)}
                activeOpacity={0.6}
              >
                <Copy size={22} color={Colors.text} variant="Outline" />
              </TouchableOpacity>
            </View>
          </View>
          );
        })}
      </ScrollView>

      {/* Floating Regenerate Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleRegenerate}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MagicStar size={24} color={Colors.textWhite} variant="Bold" />
          <Text style={styles.fabText}>More Rizz</Text>
        </LinearGradient>
      </TouchableOpacity>

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
            <Text style={styles.actionSheetTitle}>Category Options</Text>
            
            <TouchableOpacity 
              style={styles.actionSheetOption}
              onPress={handleAddToHome}
              activeOpacity={0.7}
            >
              <View style={styles.actionSheetIconContainer}>
                <Home2 size={22} color={Colors.purple} variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={styles.actionSheetOptionText}>Add to Home</Text>
                <Text style={styles.actionSheetOptionSubtext}>Pin to Quick Actions</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionSheetDivider} />

            <TouchableOpacity 
              style={styles.actionSheetOption}
              onPress={handleDeletePress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionSheetIconContainer, { backgroundColor: '#FFE5E5' }]}>
                <Trash size={22} color="#FF4444" variant="Bold" />
              </View>
              <View style={styles.actionSheetTextContainer}>
                <Text style={[styles.actionSheetOptionText, { color: '#FF4444' }]}>Delete Category</Text>
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
            <Text style={styles.deleteModalTitle}>Delete this category?</Text>
            <Text style={styles.deleteModalMessage}>
              Once deleted, all rizz lines will be permanently removed.
            </Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleConfirmDelete}
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
              onPress={handleCancelDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      <Toast visible={showToast} message={toastMessage} type={toastType} onHide={() => setShowToast(false)} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  rizzCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rizzText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
    marginRight: Spacing.md,
  },
  rizzActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  savedStarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xxl,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  fabText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
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
    backgroundColor: `${Colors.purple}15`,
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
});
