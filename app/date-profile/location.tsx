import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Location } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function LocationScreen() {
  const router = useRouter();
  const [city, setCity] = useState('');

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/date-profile/how-met');
  };

  const canContinue = city.trim().length > 0;

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={8}
      icon={Location}
      title="Where do they live?"
      helperText="Location helps us suggest nearby date spots and activities"
      onContinue={handleContinue}
      canContinue={canContinue}
      showSkip={false}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="City, State or Country"
            placeholderTextColor={Colors.textLight}
            value={city}
            onChangeText={setCity}
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
