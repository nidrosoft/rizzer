import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { People } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function HowMetScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  const [selected, setSelected] = useState(draft.how_met || '');

  const options = [
    'Dating App',
    'Work',
    'School/University',
    'Through Friends',
    'Social Event',
    'Coffee Shop',
    'Gym',
    'Online Community',
    'Other',
  ];

  const handleSelect = (option: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelected(option);
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    updateDraft({ how_met: selected });
    await saveDraft();
    setCurrentStep(9);
    router.push('/date-profile/love-language');
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
    
    if (selected) {
      updateDraft({ how_met: selected });
    }
    
    await saveDraft();
    router.back();
  };

  return (
    <OnboardingLayout
      currentStep={9}
      totalSteps={13}
      icon={People}
      title="How did you meet?"
      helperText="Understanding your connection helps us tailor conversation starters"
      onContinue={handleContinue}
      canContinue={selected.length > 0}
      showSkip={false}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => handleSelect(option)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option}</Text>
              <View style={styles.radio}>
                {selected === option && <View style={styles.radioDot} />}
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
