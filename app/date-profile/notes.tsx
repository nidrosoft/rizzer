import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Note } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/date-profile/photo');
  };

  const handleSkip = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/date-profile/photo');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1 }}>
        <OnboardingLayout
          currentStep={7}
          totalSteps={8}
          icon={Note}
          title="Personal notes"
          helperText="Add any details that will help us understand them better"
          onContinue={handleContinue}
          canContinue={notes.trim().length > 0}
          showSkip={true}
          onSkip={handleSkip}
        >
          <View style={styles.container}>
            <TextInput
              style={styles.textArea}
              placeholder="e.g., Loves Italian food, allergic to cats, works in tech, enjoys hiking on weekends..."
              placeholderTextColor={Colors.textLight}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={8}
              maxLength={500}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <Text style={styles.charCount}>
              {notes.length}/500 characters
            </Text>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 What to include:</Text>
              <Text style={styles.tipText}>• Food preferences and allergies</Text>
              <Text style={styles.tipText}>• Hobbies and favorite activities</Text>
              <Text style={styles.tipText}>• Career and education</Text>
              <Text style={styles.tipText}>• Personality traits</Text>
              <Text style={styles.tipText}>• Conversation topics they enjoy</Text>
            </View>
          </View>
        </OnboardingLayout>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  textArea: {
    height: 140,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  charCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  tipsContainer: {
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  tipsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
});
