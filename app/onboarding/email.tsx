import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Sms } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { useOnboardingStep } from '@/hooks/useOnboardingStep';

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const { handleContinue: saveAndContinue, isSaving } = useOnboardingStep({
    stepNumber: 2,
    nextRoute: '/onboarding/dateOfBirth',
    validateData: () => {
      if (!email.trim()) {
        setError('Please enter your email address');
        return false;
      }
      if (!validateEmail(email.trim())) {
        setError('Please enter a valid email address');
        return false;
      }
      setError('');
      return true;
    },
    getDataToSave: () => ({
      email: email.toLowerCase().trim(),
    }),
  });

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) setError('');
  };

  const isValid = email.trim().length > 0 && validateEmail(email.trim());

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepper}>
          <View style={styles.iconCircle}>
            <Sms size={24} color={Colors.text} variant="Outline" />
          </View>
          {[...Array(12)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index === 0 && styles.stepDotActive,
                index === 1 && styles.stepDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>What's your email?</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We'll use this as a backup way to sign in Just in case...
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={Colors.textLight}
            value={email}
            onChangeText={handleEmailChange}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
          />
          <View style={styles.underline} />
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.helperText}>
              You can verify this later in your inbox
            </Text>
          )}
        </View>

        {/* Continue Button */}
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
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    lineHeight: normalize(22),
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
    fontSize: normalize(12),
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontSize: normalize(12),
    color: Colors.error,
    marginTop: Spacing.sm,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xl,
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
    alignSelf: 'flex-end',
  },
  continueButtonDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.transparent,
  },
});
