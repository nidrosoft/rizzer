/**
 * InterestsCard Component
 * Displays interests organized by categories
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Edit2, Heart } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
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
    onEdit();
  };

  return (
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
          <Heart size={48} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.emptyTitle}>No interests added yet</Text>
          <Text style={styles.emptyText}>Tap the edit button to add interests</Text>
        </View>
      )}
    </View>
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
  tagText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
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
});
