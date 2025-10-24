import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, User } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function NameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 1,
    nextRoute: '/onboarding/dateOfBirth',
    validateData: () => firstName.trim().length >= 2,
    getDataToSave: () => ({
      name: lastName.trim() 
        ? `${firstName.trim()} ${lastName.trim()}` 
        : firstName.trim(),
    }),
  });

  const isValid = firstName.trim().length >= 2;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepper}>
          <View style={styles.iconCircle}>
            <User size={24} color={Colors.text} variant="Outline" />
          </View>
          {[...Array(12)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index === 0 && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>What's your name?</Text>

        {/* First Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor={Colors.textLight}
            value={firstName}
            onChangeText={setFirstName}
            autoFocus
            autoCapitalize="words"
          />
          <View style={styles.underline} />
        </View>

        {/* Last Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor={Colors.textLight}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
          <View style={styles.underline} />
          <Text style={styles.helperText}>
            Last name is optional, and only shared with matches.{' '}
            <Text style={styles.helperLink}>Why?</Text>
          </Text>
        </View>

        {/* Continue Button - Right after inputs */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, (!isValid || isSaving) && styles.continueButtonDisabled]}
            onPress={saveAndContinue}
            disabled={!isValid || isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <ArrowRight 
                size={28} 
                color={isValid ? Colors.background : Colors.border} 
                variant="Outline"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepperContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  stepDotActive: {
    backgroundColor: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: normalize(32),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xxl,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: normalize(20),
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  helperLink: {
    color: Colors.text,
    fontWeight: FontWeights.semibold,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: Spacing.xl,
  },
  continueButton: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    borderWidth: 2,
    borderColor: Colors.text,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.transparent,
  },
});
