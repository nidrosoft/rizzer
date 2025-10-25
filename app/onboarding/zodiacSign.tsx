import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Lovely } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';
import { useOnboardingStore } from '@/store/onboardingStore';

// Calculate zodiac sign from date of birth
function getZodiacSign(dateOfBirth: string): string {
  const date = new Date(dateOfBirth);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  
  return '';
}

export default function ZodiacSignScreen() {
  const router = useRouter();
  const onboardingData = useOnboardingStore((state) => state.data);
  const [selectedSign, setSelectedSign] = useState('');

  // Auto-detect zodiac sign from date of birth
  useEffect(() => {
    if (onboardingData.dateOfBirth) {
      const detectedSign = getZodiacSign(onboardingData.dateOfBirth);
      if (detectedSign) {
        setSelectedSign(detectedSign);
      }
    }
  }, [onboardingData.dateOfBirth]);

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
