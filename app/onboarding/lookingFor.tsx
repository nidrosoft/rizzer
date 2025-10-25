import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function LookingForScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const options = ['Men', 'Women', 'Non-binary', 'Everyone'];

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 6,
    nextRoute: '/onboarding/relationshipType',
    validateData: () => selected.length > 0,
    getDataToSave: () => ({ lookingFor: selected.join(', ') }),
  });

  const toggleOption = (option: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (selected.includes(option)) {
      setSelected(selected.filter(o => o !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <OnboardingLayout
      currentStep={6}
      totalSteps={16}
      icon={Heart}
      title="Who are you looking for?"
      helperText="Select all that apply"
      onContinue={saveAndContinue}
      canContinue={selected.length > 0 && !isSaving}
    >
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => toggleOption(option)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option}</Text>
            <View style={[styles.checkbox, selected.includes(option) && styles.checkboxSelected]}>
              {selected.includes(option) && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: Spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purple,
  },
  checkmark: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: FontWeights.bold,
  },
});
