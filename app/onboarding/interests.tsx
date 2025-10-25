import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, ArrowDown2, ArrowUp2 } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

interface Category {
  name: string;
  interests: string[];
}

export default function InterestsScreen() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<Record<string, string[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string>('Activities');

  const categories: Category[] = [
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

  const toggleCategory = (categoryName: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setExpandedCategory(expandedCategory === categoryName ? '' : categoryName);
  };

  const toggleInterest = (categoryName: string, interest: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const categoryInterests = selectedInterests[categoryName] || [];
    
    if (categoryInterests.includes(interest)) {
      // Remove interest
      setSelectedInterests({
        ...selectedInterests,
        [categoryName]: categoryInterests.filter(i => i !== interest)
      });
    } else if (categoryInterests.length < 5) {
      // Add interest (max 5 per category)
      setSelectedInterests({
        ...selectedInterests,
        [categoryName]: [...categoryInterests, interest]
      });
    }
  };

  // Check if all categories have at least 3 interests
  const isValid = () => {
    return categories.every(category => {
      const count = (selectedInterests[category.name] || []).length;
      return count >= 3;
    });
  };

  // Get total count of selected interests
  const getTotalCount = () => {
    return Object.values(selectedInterests).reduce((sum, arr) => sum + arr.length, 0);
  };

  // Get count for specific category
  const getCategoryCount = (categoryName: string) => {
    return (selectedInterests[categoryName] || []).length;
  };

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 9,
    nextRoute: '/onboarding/bio',
    validateData: () => isValid(),
    getDataToSave: () => ({
      interests: Object.values(selectedInterests).flat()
    }),
  });

  return (
    <OnboardingLayout
      currentStep={9}
      totalSteps={16}
      icon={Star}
      title="What are your interests?"
      helperText="Select at least 3 interests from each category"
      onContinue={saveAndContinue}
      canContinue={isValid() && !isSaving}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {categories.map((category, index) => (
          <View key={category.name}>
            {/* Category Header */}
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.name)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryLeft}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={[
                  styles.categoryCount,
                  getCategoryCount(category.name) >= 3 && styles.categoryCountComplete
                ]}>
                  {getCategoryCount(category.name)}/3
                </Text>
              </View>
              {expandedCategory === category.name ? (
                <ArrowUp2 size={20} color={Colors.text} variant="Outline" />
              ) : (
                <ArrowDown2 size={20} color={Colors.text} variant="Outline" />
              )}
            </TouchableOpacity>

            {/* Interests Grid */}
            {expandedCategory === category.name && (
              <View style={styles.interestsGrid}>
                {category.interests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.interestChip,
                      (selectedInterests[category.name] || []).includes(interest) && styles.selectedChip,
                    ]}
                    onPress={() => toggleInterest(category.name, interest)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.interestText,
                        (selectedInterests[category.name] || []).includes(interest) && styles.selectedText,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Separator */}
            {index < categories.length - 1 && <View style={styles.separator} />}
          </View>
        ))}

      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  categoryCount: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryCountComplete: {
    color: Colors.background,
    backgroundColor: Colors.purple,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  interestChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  selectedChip: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  interestText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  selectedText: {
    color: Colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
});
