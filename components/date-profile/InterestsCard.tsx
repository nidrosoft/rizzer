/**
 * InterestsCard Component
 * Displays interests and preferences
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, TextInput, ScrollView } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Edit2, Add, CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { InterestsCardProps } from '@/types/dateProfile';

// Categories from interests screen
const INTEREST_CATEGORIES = [
  {
    name: 'Activities',
    interests: ['Dancing', 'Yoga', 'Hiking', 'Camping', 'Skiing', 'Surfing', 'Rock climbing', 'Cycling']
  },
  {
    name: 'Food & Drink',
    interests: ['Cooking', 'Baking', 'Wine tasting', 'Coffee', 'Foodie', 'Vegetarian', 'Vegan', 'BBQ']
  },
  {
    name: 'Entertainment',
    interests: ['Movies', 'Theater', 'Concerts', 'Festivals', 'Comedy shows', 'Museums', 'Art galleries', 'Gaming']
  },
  {
    name: 'Music',
    interests: ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Country', 'EDM', 'R&B']
  },
  {
    name: 'Sports',
    interests: ['Football', 'Basketball', 'Tennis', 'Golf', 'Soccer', 'Baseball', 'Swimming', 'Running']
  },
  {
    name: 'Creative',
    interests: ['Photography', 'Writing', 'Painting', 'Drawing', 'Crafts', 'Design', 'Fashion', 'DIY']
  },
  {
    name: 'Lifestyle',
    interests: ['Travel', 'Reading', 'Meditation', 'Volunteering', 'Sustainability', 'Pets', 'Gardening', 'Astrology']
  },
];

export default function InterestsCard({ interests, onEdit }: InterestsCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  // Organize hobbies by category
  const organizeHobbiesByCategory = () => {
    const organized: { [key: string]: string[] } = {};
    
    INTEREST_CATEGORIES.forEach(category => {
      const categoryHobbies = interests.hobbies.filter(hobby => 
        category.interests.includes(hobby)
      );
      if (categoryHobbies.length > 0) {
        organized[category.name] = categoryHobbies;
      }
    });
    
    return organized;
  };
  
  const categorizedHobbies = organizeHobbiesByCategory();

  const handleEdit = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowModal(true);
  };

  const handleAddHobby = () => {
    if (newHobby.trim()) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setHobbies([...hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setHobbies(hobbies.filter((_, i) => i !== index));
  };

  const handleAddTrait = () => {
    if (newTrait.trim()) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setPersonality([...personality, newTrait.trim()]);
      setNewTrait('');
    }
  };

  const handleRemoveTrait = (index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPersonality(personality.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: Save to database
    setShowModal(false);
    onEdit();
  };

  return (
    <>
      <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Interests & Preferences</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Edit2 size={18} color={Colors.textWhite} variant="Outline" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Interests by Category */}
      {Object.keys(categorizedHobbies).length > 0 ? (
        Object.entries(categorizedHobbies).map(([categoryName, categoryHobbies]) => (
          <View key={categoryName} style={styles.section}>
            <Text style={styles.sectionLabel}>{categoryName}</Text>
            <View style={styles.tagsContainer}>
              {categoryHobbies.map((hobby, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{hobby}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No interests added yet</Text>
          <Text style={styles.emptySubtext}>Tap the edit button to add interests</Text>
        </View>
      )}
    </View>

      {/* Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Interests & Preferences</Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              {/* Hobbies Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Hobbies</Text>
                <View style={styles.tagsContainer}>
                  {hobbies.map((hobby, index) => (
                    <View key={index} style={styles.editableTag}>
                      <Text style={styles.tagText}>{hobby}</Text>
                      <TouchableOpacity onPress={() => handleRemoveHobby(index)} activeOpacity={0.7}>
                        <CloseCircle size={16} color={Colors.text} variant="Bold" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a hobby"
                    placeholderTextColor={Colors.textSecondary}
                    value={newHobby}
                    onChangeText={setNewHobby}
                    onSubmitEditing={handleAddHobby}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.addIconButton} onPress={handleAddHobby} activeOpacity={0.7}>
                    <Add size={20} color={Colors.purple} variant="Bold" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Favorites Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Favorites</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>🎨 Favorite Color</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Lavender"
                    placeholderTextColor={Colors.textSecondary}
                    value={favoriteColor}
                    onChangeText={setFavoriteColor}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>🌸 Favorite Flower</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Sunflowers"
                    placeholderTextColor={Colors.textSecondary}
                    value={favoriteFlower}
                    onChangeText={setFavoriteFlower}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>🍽️ Favorite Foods</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Italian, Sushi, Thai"
                    placeholderTextColor={Colors.textSecondary}
                    value={favoriteFood}
                    onChangeText={setFavoriteFood}
                    multiline
                  />
                </View>
              </View>

              {/* Personality Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Personality Traits</Text>
                <View style={styles.tagsContainer}>
                  {personality.map((trait, index) => (
                    <View key={index} style={[styles.editableTag, styles.personalityTag]}>
                      <Text style={styles.tagText}>{trait}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTrait(index)} activeOpacity={0.7}>
                        <CloseCircle size={16} color={Colors.text} variant="Bold" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a personality trait"
                    placeholderTextColor={Colors.textSecondary}
                    value={newTrait}
                    onChangeText={setNewTrait}
                    onSubmitEditing={handleAddTrait}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.addIconButton} onPress={handleAddTrait} activeOpacity={0.7}>
                    <Add size={20} color={Colors.purple} variant="Bold" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  editButton: {
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
  section: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  personalityTag: {
    backgroundColor: 'rgba(171, 71, 188, 0.1)',
    borderColor: 'rgba(171, 71, 188, 0.2)',
  },
  tagText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  favoritesList: {
    gap: Spacing.xs,
  },
  favoriteItem: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  modalSection: {
    marginBottom: Spacing.xl,
  },
  modalSectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  editableTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  addIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.purple}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  modalActions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  saveButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
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
