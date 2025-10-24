import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Profile } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | ''>('');

  const genderOptions = [
    { label: 'Man', value: 'male' as const },
    { label: 'Woman', value: 'female' as const },
    { label: 'Non-binary', value: 'other' as const },
    { label: 'Prefer not to say', value: 'other' as const },
  ];

  const { handleContinue, isSaving } = useOnboardingStep({
    stepNumber: 3,
    nextRoute: '/onboarding/height',
    validateData: () => selectedGender !== '',
    getDataToSave: () => ({ gender: selectedGender }),
  });

  const handleSelect = (value: 'male' | 'female' | 'other') => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGender(value);
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={12}
      icon={Profile}
      title="What's your gender?"
      helperText="This helps us personalize your experience"
      onContinue={handleContinue}
      canContinue={selectedGender !== '' && !isSaving}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
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
});
