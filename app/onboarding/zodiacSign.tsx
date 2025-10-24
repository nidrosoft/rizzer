import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Lovely } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function ZodiacSignScreen() {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState('');

  const zodiacSigns = [
    { emoji: '♈', name: 'Aries' },
    { emoji: '♉', name: 'Taurus' },
    { emoji: '♊', name: 'Gemini' },
    { emoji: '♋', name: 'Cancer' },
    { emoji: '♌', name: 'Leo' },
    { emoji: '♍', name: 'Virgo' },
    { emoji: '♎', name: 'Libra' },
    { emoji: '♏', name: 'Scorpio' },
    { emoji: '♐', name: 'Sagittarius' },
    { emoji: '♑', name: 'Capricorn' },
    { emoji: '♒', name: 'Aquarius' },
    { emoji: '♓', name: 'Pisces' },
  ];

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 7,
    nextRoute: '/onboarding/drinking',
    validateData: () => selectedSign !== '',
    getDataToSave: () => ({ zodiacSign: selectedSign }),
  });

  const handleSelect = (sign: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedSign(sign);
  };

  return (
    <OnboardingLayout
      currentStep={7}
      totalSteps={12}
      icon={Lovely}
      title="What's your zodiac sign?"
      helperText="We've auto-detected it based on your birthday"
      onContinue={saveAndContinue}
      canContinue={selectedSign !== '' && !isSaving}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.optionsContainer}>
          {zodiacSigns.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.optionRow}
              onPress={() => handleSelect(item.name)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.zodiacEmoji}>{item.emoji}</Text>
                <Text style={styles.optionText}>{item.name}</Text>
              </View>
              <View style={styles.radio}>
                {selectedSign === item.name && <View style={styles.radioDot} />}
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
    paddingBottom: Spacing.md,
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
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  zodiacEmoji: {
    fontSize: 24,
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
