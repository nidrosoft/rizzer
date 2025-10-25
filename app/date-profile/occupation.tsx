import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Briefcase } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function OccupationScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [occupation, setOccupation] = useState(draft.occupation || '');

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    updateDraft({ occupation: occupation.trim() });
    await saveDraft();
    setCurrentStep(4);
    router.push('/date-profile/height');
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
    updateDraft({ occupation: occupation.trim() });
    await saveDraft();
    router.back();
  };

  const canContinue = occupation.trim().length >= 2;

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={13}
      icon={Briefcase}
      title="What do they do?"
      helperText="Their job, career, or what they're studying"
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
            placeholder="e.g. Software Engineer, Teacher, Student"
            placeholderTextColor={Colors.textLight}
            value={occupation}
            onChangeText={setOccupation}
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
          />
          <View style={styles.underline} />
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    // No gap needed
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
