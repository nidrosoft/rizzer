import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Lovely } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function RelationshipStageScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const options = [
    { value: 'Just Met', description: 'Recently connected, getting to know each other' },
    { value: 'Talking', description: 'Regular conversations, building connection' },
    { value: 'Dating', description: 'Going on dates, exploring compatibility' },
    { value: 'Serious', description: 'Committed relationship' },
    { value: 'Engaged', description: 'Planning to get married' },
    { value: 'Married', description: 'In a marriage' },
    { value: 'Divorced', description: 'Previously married' },
  ];

  const handleSelect = (option: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelected(option);
  };

  const handleContinue = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/date-profile/important-dates');
  };

  const handleSkip = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/date-profile/important-dates');
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={8}
      icon={Lovely}
      title="What's your current status?"
      helperText="This helps us provide advice appropriate for your relationship stage"
      onContinue={handleContinue}
      canContinue={selected.length > 0}
      showSkip={true}
      onSkip={handleSkip}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selected === option.value && styles.optionCardSelected
              ]}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  selected === option.value && styles.optionTitleSelected
                ]}>
                  {option.value}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selected === option.value && styles.optionDescriptionSelected
                ]}>
                  {option.description}
                </Text>
              </View>
              <View style={styles.radio}>
                {selected === option.value && <View style={styles.radioDot} />}
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
    gap: 0,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionCardSelected: {
    backgroundColor: Colors.background,
  },
  optionContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  optionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  optionTitleSelected: {
    color: Colors.text,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  optionDescriptionSelected: {
    color: Colors.textSecondary,
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
