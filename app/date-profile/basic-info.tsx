import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { User } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function BasicInfoScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [firstName, setFirstName] = useState(draft.first_name || '');
  const [lastName, setLastName] = useState(draft.last_name || '');

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Update draft
    updateDraft({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    });
    
    // Save to database
    await saveDraft();
    
    // Update step and navigate
    setCurrentStep(1);
    router.push('/date-profile/date-of-birth');
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
    
    updateDraft({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    });
    
    await saveDraft();
    router.back();
  };

  const canContinue = firstName.trim().length > 0;

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={13}
      icon={User}
      title="Basic Information"
      helperText="Help us know who they are for personalized suggestions"
      onContinue={handleContinue}
      canContinue={canContinue}
      showSkip={false}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor={Colors.textLight}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
          />
          <View style={styles.underline} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Last name (optional)"
            placeholderTextColor={Colors.textLight}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <View style={styles.underline} />
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    // No gap needed - spacing handled by inputContainer
  },
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
