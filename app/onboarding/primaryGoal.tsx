import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function PrimaryGoalScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('');

  const goals = [
    { icon: '❤️', title: 'Fun & Love', subtitle: 'Looking for romance' },
    { icon: '😊', title: 'Casual Dating', subtitle: 'Keep it light and fun' },
    { icon: '👥', title: 'Make Friends', subtitle: 'Expand social circle' },
    { icon: '🤷', title: 'Not Sure Yet', subtitle: 'Open to possibilities' },
  ];

  const handleSelect = (goal: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGoal(goal);
  };

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 16,
    nextRoute: '/onboarding/setup-loading',
    validateData: () => selectedGoal !== '',
    getDataToSave: () => ({ primaryGoal: selectedGoal }),
  });

  return (
    <OnboardingLayout
      currentStep={16}
      totalSteps={12}
      icon={Heart}
      title="What's your primary goal?"
      helperText="This helps us personalize your experience"
      onContinue={saveAndContinue}
      canContinue={selectedGoal !== '' && !isSaving}
    >
      <View style={styles.goalsGrid}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.title}
            style={[styles.goalCard, selectedGoal === goal.title && styles.selectedCard]}
            onPress={() => handleSelect(goal.title)}
            activeOpacity={0.7}
          >
            <Text style={styles.goalIcon}>{goal.icon}</Text>
            <Text style={[styles.goalTitle, selectedGoal === goal.title && styles.selectedText]}>
              {goal.title}
            </Text>
            <Text style={[styles.goalSubtitle, selectedGoal === goal.title && styles.selectedSubtitle]}>
              {goal.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  goalCard: {
    width: '48%',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  selectedCard: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  goalIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  goalTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.textWhite,
  },
  goalSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectedSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
