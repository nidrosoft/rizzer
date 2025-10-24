/**
 * Favorites Category Detail Screen
 * Favorite restaurants, places, and activities
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Location, Shop, Activity, More } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('restaurants');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAdd = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowAddModal(true);
  };

  const handleMenu = () => {
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

  const confirmDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDeleteModal(false);
    setTimeout(() => router.back(), 500);
  };

  const confirmArchive = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowArchiveModal(false);
    setTimeout(() => router.back(), 500);
  };

  // Mock favorites data
  const favorites = {
    restaurants: [
      { id: '1', name: 'Bella Italia', type: 'Italian', location: 'Downtown', rating: 5, notes: 'Her favorite pasta place' },
      { id: '2', name: 'Sushi Paradise', type: 'Japanese', location: 'Midtown', rating: 5, notes: 'Amazing sashimi' },
      { id: '3', name: 'The Coffee House', type: 'Café', location: 'Central Park', rating: 4, notes: 'Our first date spot' },
    ],
    places: [
      { id: '1', name: 'Central Park', type: 'Park', location: 'Manhattan', notes: 'Perfect for walks and picnics' },
      { id: '2', name: 'Art Museum', type: 'Museum', location: 'Upper East Side', notes: 'She loves the modern art section' },
      { id: '3', name: 'Sunset Beach', type: 'Beach', location: 'Long Island', notes: 'Beautiful sunsets together' },
    ],
    activities: [
      { id: '1', name: 'Yoga Classes', type: 'Fitness', frequency: 'Weekly', notes: 'Sunday morning yoga together' },
      { id: '2', name: 'Cooking Together', type: 'Hobby', frequency: 'Often', notes: 'Making homemade pasta' },
      { id: '3', name: 'Movie Nights', type: 'Entertainment', frequency: 'Weekly', notes: 'Friday night tradition' },
    ],
  };

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      'restaurants': '🍽️',
      'places': '📍',
      'activities': '🎯',
    };
    return icons[category] || '⭐';
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

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
        <Text style={styles.headerTitle}>Favorites</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
          <More size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          {['restaurants', 'places', 'activities'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, selectedCategory === category && styles.categoryTabActive]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryTabIcon}>{getCategoryIcon(category)}</Text>
              <Text style={[styles.categoryTabText, selectedCategory === category && styles.categoryTabTextActive]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Restaurants */}
        {selectedCategory === 'restaurants' && (
          <View style={styles.categoryContent}>
            {favorites.restaurants.map((item) => (
              <View key={item.id} style={styles.favoriteCard}>
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteIcon}>
                    <Shop size={24} color={Colors.purple} variant="Bold" />
                  </View>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{item.name}</Text>
                    <Text style={styles.favoriteType}>{item.type}</Text>
                  </View>
                </View>
                <View style={styles.favoriteDetails}>
                  <View style={styles.favoriteDetailRow}>
                    <Location size={16} color={Colors.textSecondary} variant="Outline" />
                    <Text style={styles.favoriteDetailText}>{item.location}</Text>
                  </View>
                  <Text style={styles.favoriteRating}>{renderStars(item.rating)}</Text>
                </View>
                <Text style={styles.favoriteNotes}>{item.notes}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Places */}
        {selectedCategory === 'places' && (
          <View style={styles.categoryContent}>
            {favorites.places.map((item) => (
              <View key={item.id} style={styles.favoriteCard}>
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteIcon}>
                    <Location size={24} color="#10B981" variant="Bold" />
                  </View>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{item.name}</Text>
                    <Text style={styles.favoriteType}>{item.type}</Text>
                  </View>
                </View>
                <View style={styles.favoriteDetails}>
                  <View style={styles.favoriteDetailRow}>
                    <Location size={16} color={Colors.textSecondary} variant="Outline" />
                    <Text style={styles.favoriteDetailText}>{item.location}</Text>
                  </View>
                </View>
                <Text style={styles.favoriteNotes}>{item.notes}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Activities */}
        {selectedCategory === 'activities' && (
          <View style={styles.categoryContent}>
            {favorites.activities.map((item) => (
              <View key={item.id} style={styles.favoriteCard}>
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteIcon}>
                    <Activity size={24} color="#2196F3" variant="Bold" />
                  </View>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{item.name}</Text>
                    <Text style={styles.favoriteType}>{item.type}</Text>
                  </View>
                </View>
                <View style={styles.favoriteDetails}>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyText}>{item.frequency}</Text>
                  </View>
                </View>
                <Text style={styles.favoriteNotes}>{item.notes}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* Category Action Sheet */}
      <CategoryActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onArchive={handleArchive}
        onDelete={handleDelete}
        title="Manage Favorites"
        deleteModalVisible={showDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={confirmDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => setShowDeleteModal(false)}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage="This action cannot be undone. All favorite places and activities will be permanently removed."
        archiveMessage="Favorites will be moved to archives. You can restore them anytime."
      />

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Favorite</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Category</Text>
                <View style={styles.modalCategoryOptions}>
                  {['restaurants', 'places', 'activities'].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={styles.modalCategoryOption}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalCategoryIcon}>{getCategoryIcon(category)}</Text>
                      <Text style={styles.modalCategoryText}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter name..."
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Type</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Italian, Park, Hobby, etc."
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Location / Frequency</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Location or how often..."
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputMultiline]}
                  placeholder="Why is this a favorite?"
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Save Favorite</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
              activeOpacity={0.7}
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
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: '#FAFAFA' },
  navButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.text },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  categoryTabs: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  categoryTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: Colors.background, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  categoryTabActive: { backgroundColor: Colors.purple },
  categoryTabIcon: { fontSize: 18 },
  categoryTabText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.textSecondary },
  categoryTabTextActive: { color: Colors.textWhite },
  categoryContent: { gap: Spacing.md },
  favoriteCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  favoriteHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  favoriteIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center' },
  favoriteInfo: { flex: 1 },
  favoriteName: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: 2 },
  favoriteType: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  favoriteDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  favoriteDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  favoriteDetailText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  favoriteRating: { fontSize: FontSizes.sm },
  frequencyBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm },
  frequencyText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold, color: '#2196F3' },
  favoriteNotes: { fontSize: FontSizes.sm, color: Colors.text, lineHeight: 20, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalSection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: Spacing.sm },
  modalCategoryOptions: { flexDirection: 'row', gap: Spacing.sm },
  modalCategoryOption: { flex: 1, alignItems: 'center', backgroundColor: '#F3F0FF', paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  modalCategoryIcon: { fontSize: 24, marginBottom: 4 },
  modalCategoryText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold, color: Colors.purple },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.md, color: Colors.text, minHeight: 48 },
  modalInputMultiline: { minHeight: 100 },
  saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
});
