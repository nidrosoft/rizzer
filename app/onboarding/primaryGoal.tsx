import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingScreen from '@/components/ui/OnboardingScreen';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function PrimaryGoalScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState('');

  const goals = [
    { icon: '❤️', title: 'Find Love', subtitle: 'Looking for a serious relationship' },
    { icon: '😊', title: 'Casual Dating', subtitle: 'Keep it light and fun' },
    { icon: '👥', title: 'Make Friends', subtitle: 'Expand my social circle' },
    { icon: '🎯', title: 'Not Sure Yet', subtitle: 'Open to possibilities' },
  ];

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 16,
    nextRoute: '/onboarding/setup-loading',
    validateData: () => selectedGoal !== '',
    getDataToSave: () => ({ primaryGoal: selectedGoal }),
  });

  return (
    <OnboardingScreen
      currentStep={16}
      totalSteps={12}
      title="What's your primary goal?"
      subtitle="This helps us personalize your experience"
      onContinue={saveAndContinue}
      canContinue={selectedGoal !== '' && !isSaving}
    >
      <View style={styles.goalsContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.title}
            style={[styles.goalCard, selectedGoal === goal.title && styles.selectedCard]}
            onPress={() => setSelectedGoal(goal.title)}
          >
            <Text style={styles.goalIcon}>{goal.icon}</Text>
            <Text style={[styles.goalTitle, selectedGoal === goal.title && styles.selectedText]}>
              {goal.title}
            </Text>
            <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  goalsContainer: {
    gap: Spacing.md,
  },
  goalCard: {
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
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
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  selectedText: {
    color: Colors.textWhite,
  },
  goalSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
