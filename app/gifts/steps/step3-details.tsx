/**
 * Step 3: Details (Relationship Context + Date)
 * Third step in the new investigation flow
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar, DollarCircle, LanguageSquare } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { Language } from '@/types/gifts';
import StepLayout from '@/components/gifts/StepLayout';
import FormInput from '@/components/ui/FormInput';
import SectionHeader from '@/components/ui/SectionHeader';
import ContinueButton from '@/components/gifts/ContinueButton';
import DatePickerInput from '@/components/ui/DatePickerInput';

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'english', label: 'English', flag: '🇺🇸' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
];

export default function Step3DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [relationshipContext, setRelationshipContext] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [budget, setBudget] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [occasionDate, setOccasionDate] = useState<Date | null>(null);

  const isFormValid = relationshipContext.trim().length > 0;

  const handleContinue = () => {
    if (!isFormValid) return;
    
    // Navigate to Step 4 (Platform & Preview) with all data
    router.push({
      pathname: '/gifts/steps/step4-platform',
      params: {
        ...params,
        relationshipContext,
        extraInstructions,
        budget,
        language,
        occasionDate: occasionDate?.toISOString() || '',
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StepLayout
      title="New Investigation"
      currentStep={2}
      totalSteps={5}
      stepTitle="Add Details"
      onBack={handleBack}
    >
      <View style={styles.container}>
        {/* Form */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Relationship Context */}
            <SectionHeader
              title="Relationship Context"
              subtitle="Help Sherlock understand your connection"
            />
            <FormInput
              placeholder="e.g., We're friends and we know each other from tennis club"
              value={relationshipContext}
              onChangeText={setRelationshipContext}
              multiline
              numberOfLines={4}
              maxLength={200}
            />

            {/* Extra Instructions */}
            <SectionHeader
              title="Extra Instructions (Optional)"
              subtitle="Guide Sherlock's conversation"
            />
            <FormInput
              placeholder="e.g., Ask about tennis gear, mention his dog Max, focus on outdoor activities"
              value={extraInstructions}
              onChangeText={setExtraInstructions}
              multiline
              numberOfLines={4}
              maxLength={300}
            />

            {/* Budget */}
            <SectionHeader
              title="Budget (Optional)"
              subtitle="Approximate budget for the gift"
            />
            <FormInput
              placeholder="e.g., $50"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />

            {/* Language Selection */}
            <SectionHeader
              title="Message Language"
              subtitle="Sherlock will chat in this language"
            />
            <View style={styles.languageGrid}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.languageCard,
                    language === lang.value && styles.languageCardSelected,
                  ]}
                  onPress={() => setLanguage(lang.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageLabel,
                    language === lang.value && styles.languageLabelSelected,
                  ]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Occasion Date */}
            <SectionHeader
              title="Occasion Date (Optional)"
              subtitle="When is the special day?"
            />
            <DatePickerInput
              value={occasionDate}
              onChange={setOccasionDate}
              placeholder="Select date"
            />
          </View>
        </ScrollView>

        {/* Continue Button */}
        {isFormValid && (
          <ContinueButton onPress={handleContinue} />
        )}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  charCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.lg,
  },
  dateSection: {
    marginTop: Spacing.md,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  languageCard: {
    width: '31%',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  languageCardSelected: {
    backgroundColor: Colors.background,
    borderColor: Colors.gradientStart,
    borderWidth: 2,
  },
  languageFlag: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  languageLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  languageLabelSelected: {
    color: Colors.gradientStart,
    fontWeight: FontWeights.bold,
  },
});
