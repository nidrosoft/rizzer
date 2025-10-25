import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Cup } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function DrinkingScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const options = [
    'Never',
    'Rarely',
    'Socially',
    'Regularly',
    'Prefer not to say',
  ];

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 16,
    nextRoute: '/onboarding/setup-loading',
    validateData: () => selected !== '',
    getDataToSave: () => ({ drinking: selected }),
  });

  const handleSelect = (option: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelected(option);
  };

  return (
    <OnboardingLayout
      currentStep={16}
      totalSteps={16}
      icon={Cup}
      title="Do you drink?"
      helperText="Help us match you with compatible people"
      onContinue={saveAndContinue}
      canContinue={selected !== '' && !isSaving}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => handleSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option}</Text>
            <View style={styles.radio}>
              {selected === option && <View style={styles.radioDot} />}
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
    fontSize: FontSizes.md,
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
