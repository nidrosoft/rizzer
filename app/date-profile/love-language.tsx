import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Heart } from 'iconsax-react-native';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';
import { normalize } from '@/utils/responsive';

const LOVE_LANGUAGES = [
  {
    value: 'words_of_affirmation',
    label: 'Words of Affirmation',
    icon: '💬',
    description: 'Verbal compliments and encouragement',
  },
  {
    value: 'quality_time',
    label: 'Quality Time',
    icon: '⏰',
    description: 'Undivided attention and togetherness',
  },
  {
    value: 'receiving_gifts',
    label: 'Receiving Gifts',
    icon: '🎁',
    description: 'Thoughtful presents and tokens',
  },
  {
    value: 'acts_of_service',
    label: 'Acts of Service',
    icon: '🤝',
    description: 'Helpful actions and support',
  },
  {
    value: 'physical_touch',
    label: 'Physical Touch',
    icon: '🤗',
    description: 'Hugs, kisses, and affection',
  },
];

export default function LoveLanguageScreen() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft, setCurrentStep } = useDateProfileCreationStore();
  
  // Convert string to array for multi-select
  const initialLanguages = draft.love_language ? [draft.love_language] : [];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(initialLanguages);

  const handleSelect = (value: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedLanguages(prev => {
      if (prev.includes(value)) {
        // Remove if already selected
        return prev.filter(lang => lang !== value);
      } else {
        // Add to selection
        return [...prev, value];
      }
    });
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Save first selected language (or all as comma-separated if needed)
    updateDraft({ love_language: selectedLanguages[0] || '' });
    await saveDraft();
    setCurrentStep(10);
    router.push('/date-profile/interests');
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
    await saveDraft();
    router.back();
  };

  const canContinue = selectedLanguages.length > 0;

  return (
    <OnboardingLayout
      currentStep={10}
      totalSteps={13}
      icon={Heart}
      title="What's their love language?"
      helperText="Pick all that apply - they might speak love in multiple ways! 💕"
      onContinue={handleContinue}
      canContinue={canContinue}
      showSkip={false}
      onCancel={handleCancel}
      onSaveAsDraft={handleSaveAsDraft}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {LOVE_LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.value}
              style={[
                styles.languageCard,
                selectedLanguages.includes(language.value) && styles.languageCardSelected,
              ]}
              onPress={() => handleSelect(language.value)}
              activeOpacity={0.7}
            >
              <View style={styles.languageHeader}>
                <Text style={styles.languageIcon}>{language.icon}</Text>
                <View style={styles.languageContent}>
                  <Text
                    style={[
                      styles.languageLabel,
                      selectedLanguages.includes(language.value) && styles.languageLabelSelected,
                    ]}
                  >
                    {language.label}
                  </Text>
                  <Text style={styles.languageDescription}>{language.description}</Text>
                </View>
                {selectedLanguages.includes(language.value) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  languageCard: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  languageCardSelected: {
    borderColor: Colors.purple,
    backgroundColor: 'rgba(171, 71, 188, 0.05)',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    fontSize: normalize(32),
    marginRight: Spacing.md,
  },
  languageContent: {
    flex: 1,
  },
  languageLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  languageLabelSelected: {
    color: Colors.purple,
  },
  languageDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  checkmarkText: {
    color: Colors.background,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
});
