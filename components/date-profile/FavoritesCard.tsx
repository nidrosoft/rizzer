/**
 * FavoritesCard Component
 * Displays favorite things with icon + text entries
 * Includes bottom sheet for adding new favorites
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Add, CloseCircle, Star1 } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface Favorite {
  id: string;
  icon: string;
  category: string;
  value: string;
}

interface FavoritesCardProps {
  favorites: Favorite[];
  onAdd?: (favorite: Favorite) => void;
  onRemove?: (id: string) => void;
}

// Common favorite categories with icons
const FAVORITE_CATEGORIES = [
  { label: 'Color', icon: '🎨' },
  { label: 'Flower', icon: '🌸' },
  { label: 'Food', icon: '🍽️' },
  { label: 'Restaurant', icon: '🍴' },
  { label: 'Music', icon: '🎵' },
  { label: 'Movie', icon: '🎬' },
  { label: 'Book', icon: '📚' },
  { label: 'Place', icon: '📍' },
  { label: 'Activity', icon: '⚡' },
  { label: 'Drink', icon: '☕' },
  { label: 'Season', icon: '🍂' },
  { label: 'Animal', icon: '🐾' },
  { label: 'Sport', icon: '⚽' },
  { label: 'Hobby', icon: '🎯' },
  { label: 'Other', icon: '💫' },
];

export default function FavoritesCard({ favorites = [], onAdd, onRemove }: FavoritesCardProps) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(FAVORITE_CATEGORIES[0]);
  const [favoriteValue, setFavoriteValue] = useState('');

  const handleOpenBottomSheet = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowBottomSheet(true);
  };

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
    setFavoriteValue('');
    setSelectedCategory(FAVORITE_CATEGORIES[0]);
  };

  const handleAddFavorite = () => {
    if (favoriteValue.trim()) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const newFavorite: Favorite = {
        id: Date.now().toString(),
        icon: selectedCategory.icon,
        category: selectedCategory.label,
        value: favoriteValue.trim(),
      };
      
      onAdd?.(newFavorite);
      handleCloseBottomSheet();
    }
  };

  const handleRemoveFavorite = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRemove?.(id);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>⭐ Favorites</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenBottomSheet}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Add size={18} color={Colors.textWhite} variant="Outline" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <View style={styles.favoritesList}>
            {favorites.map((favorite, index) => (
              <View key={favorite.id}>
                <View style={styles.favoriteItem}>
                  <View style={styles.favoriteContent}>
                    <Text style={styles.favoriteIcon}>{favorite.icon}</Text>
                    <View style={styles.favoriteTextContainer}>
                      <Text style={styles.favoriteCategory}>{favorite.category}</Text>
                      <Text style={styles.favoriteValue}>{favorite.value}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(favorite.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <CloseCircle size={20} color={Colors.textSecondary} variant="Bold" />
                  </TouchableOpacity>
                </View>
                {index < favorites.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Star1 size={48} color={Colors.textSecondary} variant="Outline" />
            <Text style={styles.emptyTitle}>No favorites added yet</Text>
            <Text style={styles.emptyText}>Tap the + button to add favorites</Text>
          </View>
        )}
      </View>

      {/* Add Favorite Bottom Sheet */}
      <Modal
        visible={showBottomSheet}
        transparent
        animationType="slide"
        onRequestClose={handleCloseBottomSheet}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={handleCloseBottomSheet}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Add Favorite</Text>

            {/* Category Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {FAVORITE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.label}
                    style={[
                      styles.categoryChip,
                      selectedCategory.label === category.label && styles.categoryChipSelected
                    ]}
                    onPress={() => {
                      if (Platform.OS === 'ios') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setSelectedCategory(category);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryLabel,
                      selectedCategory.label === category.label && styles.categoryLabelSelected
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Value Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {selectedCategory.icon} Favorite {selectedCategory.label}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`e.g., ${selectedCategory.label === 'Color' ? 'Lavender' : selectedCategory.label === 'Food' ? 'Italian' : selectedCategory.label === 'Movie' ? 'The Notebook' : 'Your favorite'}`}
                placeholderTextColor={Colors.textSecondary}
                value={favoriteValue}
                onChangeText={setFavoriteValue}
                onSubmitEditing={handleAddFavorite}
                returnKeyType="done"
                autoFocus
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, !favoriteValue.trim() && styles.buttonDisabled]}
                onPress={handleAddFavorite}
                disabled={!favoriteValue.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={favoriteValue.trim() ? [Colors.gradientStart, Colors.gradientEnd] : [Colors.borderLight, Colors.borderLight]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.buttonText, !favoriteValue.trim() && styles.buttonTextDisabled]}>
                    Add Favorite
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseBottomSheet}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritesList: {
    gap: 0,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  favoriteTextContainer: {
    flex: 1,
  },
  favoriteCategory: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  favoriteValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  categoriesScroll: {
    gap: Spacing.xs,
    paddingRight: Spacing.xl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: `${Colors.purple}15`,
    borderColor: Colors.purple,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  categoryLabelSelected: {
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actions: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  button: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  buttonTextDisabled: {
    color: Colors.textSecondary,
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
