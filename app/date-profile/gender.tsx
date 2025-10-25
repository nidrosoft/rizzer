import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Profile2User } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

const genderOptions = [
  { label: 'Male', value: 'male', key: 'male' },
  { label: 'Female', value: 'female', key: 'female' },
  { label: 'Other', value: 'other', key: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say', key: 'prefer-not-say' },
];

export default function GenderScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [selectedGender, setSelectedGender] = useState(draft.gender || '');

  const handleSelect = (value: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGender(value);
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    updateDraft({ gender: selectedGender });
    await saveDraft();
    setCurrentStep(4);
    router.push('/date-profile/occupation');
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
    await saveDraft();
    router.back();
  };

  const canContinue = selectedGender !== '';

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={13}
      icon={Profile2User}
      title="What's their gender?"
      helperText="This helps us personalize suggestions"
      onContinue={handleContinue}
      canContinue={canContinue}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.optionRow}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              <View style={styles.radio}>
                {selectedGender === option.value && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    paddingBottom: Spacing.xxl,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionText: {
    fontSize: normalize(16),
    color: Colors.text,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.purple,
  },
  checkmarkText: {
    color: Colors.background,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
});
