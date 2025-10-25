import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Heart } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function InterestsScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(draft.hobbies || []);

  const interests = [
    'Travel', 'Music', 'Movies', 'Sports', 'Fitness', 'Cooking',
    'Art', 'Photography', 'Reading', 'Gaming', 'Dancing', 'Hiking',
    'Yoga', 'Coffee', 'Wine', 'Fashion', 'Technology', 'Pets',
    'Food', 'Nature', 'Beach', 'Mountains', 'Theater', 'Comedy',
  ];

  const handleToggle = (interest: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 10) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    updateDraft({ hobbies: selectedInterests });
    await saveDraft();
    setCurrentStep(11);
    router.push('/date-profile/important-dates');
  };

  const handleCancel = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const handleSaveAsDraft = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (selectedInterests.length > 0) {
      updateDraft({ hobbies: selectedInterests });
    }
    
    await saveDraft();
    router.back();
  };

  return (
    <OnboardingLayout
      currentStep={11}
      totalSteps={13}
      icon={Heart}
      title="What are their interests?"
      helperText={`Select interests to help us suggest perfect date ideas (${selectedInterests.length}/10)`}
      onContinue={handleContinue}
      canContinue={selectedInterests.length > 0}
      showSkip={true}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.interestsContainer}>
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                style={[styles.interestTag, isSelected && styles.interestTagSelected]}
                onPress={() => handleToggle(interest)}
                activeOpacity={0.7}
              >
                <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  interestTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  interestTagSelected: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  interestText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  interestTextSelected: {
    color: Colors.textWhite,
  },
});
