/**
 * AI Date Planner - Step 1: Basic Preferences
 * Select occasion, vibe, budget, and duration
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path } from 'react-native-svg';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { OCCASIONS, VIBES, BUDGETS, DURATIONS } from '@/constants/datePlanner';

export default function Step1Preferences() {
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleContinue = () => {
    if (!selectedOccasion || !selectedVibe || !selectedBudget || !selectedDuration) {
      return;
    }
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Pass data to next step
    router.push({
      pathname: '/discovery/date-planner/step2-details',
      params: {
        occasion: selectedOccasion,
        vibe: selectedVibe,
        budget: selectedBudget,
        duration: selectedDuration,
      },
    });
  };

  const isComplete = selectedOccasion && selectedVibe && selectedBudget && selectedDuration;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <View style={styles.backCircle}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
              <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
            </Svg>
          </View>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Date Preferences</Text>
          <Text style={styles.headerSubtitle}>Step 1 of 5</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={[styles.progressFill, { width: '20%' }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Occasion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's the occasion?</Text>
          <View style={styles.optionsGrid}>
            {OCCASIONS.map((occasion) => (
              <TouchableOpacity
                key={occasion.id}
                style={[
                  styles.optionCard,
                  selectedOccasion === occasion.id && styles.optionCardSelected,
                ]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedOccasion(occasion.id);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{occasion.icon}</Text>
                <Text style={[
                  styles.optionLabel,
                  selectedOccasion === occasion.id && styles.optionLabelSelected,
                ]}>
                  {occasion.label}
                </Text>
                <Text style={styles.optionDescription}>{occasion.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vibe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What vibe are you going for?</Text>
          <View style={styles.optionsGrid}>
            {VIBES.map((vibe) => (
              <TouchableOpacity
                key={vibe.id}
                style={[
                  styles.optionCard,
                  selectedVibe === vibe.id && styles.optionCardSelected,
                ]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedVibe(vibe.id);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{vibe.icon}</Text>
                <Text style={[
                  styles.optionLabel,
                  selectedVibe === vibe.id && styles.optionLabelSelected,
                ]}>
                  {vibe.label}
                </Text>
                <Text style={styles.optionDescription}>{vibe.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's your budget?</Text>
          <View style={styles.optionsGrid}>
            {BUDGETS.map((budget) => (
              <TouchableOpacity
                key={budget.id}
                style={[
                  styles.optionCard,
                  selectedBudget === budget.id && styles.optionCardSelected,
                ]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedBudget(budget.id);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{budget.icon}</Text>
                <Text style={[
                  styles.optionLabel,
                  selectedBudget === budget.id && styles.optionLabelSelected,
                ]}>
                  {budget.label}
                </Text>
                <Text style={styles.optionDescription}>{budget.range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How long do you have?</Text>
          <View style={styles.optionsGrid}>
            {DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.optionCard,
                  selectedDuration === duration.id && styles.optionCardSelected,
                ]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedDuration(duration.id);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{duration.icon}</Text>
                <Text style={[
                  styles.optionLabel,
                  selectedDuration === duration.id && styles.optionLabelSelected,
                ]}>
                  {duration.label}
                </Text>
                <Text style={styles.optionDescription}>{duration.hours}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !isComplete && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!isComplete}
        >
          <LinearGradient
            colors={isComplete ? [Colors.gradientStart, Colors.gradientEnd] : ['#E0E0E0', '#E0E0E0']}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  optionCard: {
    width: '47%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: Colors.purple,
    backgroundColor: `${Colors.purple}10`,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  optionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: Colors.purple,
  },
  optionDescription: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  continueButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
