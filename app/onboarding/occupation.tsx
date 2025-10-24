import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function OccupationScreen() {
  const router = useRouter();
  const [occupation, setOccupation] = useState('');

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 9,
    nextRoute: '/onboarding/interests',
    validateData: () => occupation.trim().length >= 2,
    getDataToSave: () => ({ occupation: occupation.trim() }),
  });

  return (
    <OnboardingLayout
      currentStep={9}
      totalSteps={12}
      icon={Briefcase}
      title="What do you do for work?"
      helperText="This helps us understand your lifestyle"
      onContinue={saveAndContinue}
      canContinue={occupation.trim().length >= 2 && !isSaving}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your occupation"
          placeholderTextColor={Colors.textLight}
          value={occupation}
          onChangeText={setOccupation}
          autoFocus
          autoCapitalize="words"
        />
        <View style={styles.underline} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.xs,
  },
});
