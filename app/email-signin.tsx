/**
 * Email Sign-In Screen
 * Matches phone-signin.tsx exactly, but with email input
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sms, ArrowRight, InfoCircle, Danger, CloseSquare, Google } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';
import { supabase } from '@/lib/supabase';
import AlertModal from '@/components/ui/AlertModal';
import * as Haptics from 'expo-haptics';

export default function EmailSignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; message: string; icon: React.ReactNode }>({ 
    title: '', 
    message: '', 
    icon: null 
  });

  // Handle email input
  const handleEmailChange = (text: string) => {
    setEmail(text.trim());
    
    // Clear validation error when user types
    if (validationError) {
      setValidationError('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Validate email
    if (!email.trim()) {
      setErrorMessage({
        icon: <InfoCircle size={24} color={Colors.purple} variant="Bold" />,
        title: 'Email required',
        message: 'Please enter your email address to continue.'
      });
      setShowErrorModal(true);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage({
        icon: <InfoCircle size={24} color={Colors.purple} variant="Bold" />,
        title: 'Invalid email',
        message: 'Please enter a valid email address.'
      });
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Check if user exists with this email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, phone_number')
        .eq('email', email.toLowerCase().trim())
        .single() as { data: { id: string; email: string; phone_number: string } | null; error: any };

      if (userError || !userData) {
        // Email not found
        setErrorMessage({
          icon: <Danger size={24} color="#FF6B6B" variant="Bold" />,
          title: 'Email not found',
          message: 'We couldn\'t find an account with this email address. Please check and try again, or sign up with your phone number.'
        });
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      // For Expo testing: Sign in directly with phone number
      // In production, this would send a magic link instead
      console.log('✅ [EMAIL-SIGNIN] Email found, signing in with phone:', userData.phone_number);
      
      // Send OTP to the phone number associated with this email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: userData.phone_number,
      });

      if (otpError) {
        console.error('OTP error:', otpError);
        setErrorMessage({
          icon: <Danger size={24} color="#FF6B6B" variant="Bold" />,
          title: 'Something went wrong',
          message: 'We found your account but couldn\'t send the verification code. Please try again.'
        });
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Success - navigate to OTP screen
      console.log('✅ [EMAIL-SIGNIN] OTP sent, navigating to verification');
      router.push({
        pathname: '/phone-otp',
        params: { phoneNumber: userData.phone_number }
      });

    } catch (error: any) {
      console.error('Email sign-in error:', error);
      setErrorMessage({
        icon: <Danger size={24} color="#FF6B6B" variant="Bold" />,
        title: 'Error',
        message: 'Something went wrong. Please try again.'
      });
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowGoogleModal(true);
  };

  const isValid = email.trim().length > 0 && validateEmail(email);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container} edges={['top']}>
          {/* Close Button - Right Side */}
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <CloseSquare size={28} color={Colors.text} variant="Outline" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Sms size={28} color={Colors.text} variant="Outline" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Let's get you back in...</Text>

          {/* Email Input */}
          <View style={styles.emailInputSection}>
            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor={Colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              autoFocus
            />
          </View>

          <View style={styles.underline} />

          {/* Validation Error */}
          {validationError ? (
            <Text style={styles.errorText}>{validationError}</Text>
          ) : null}

          {/* Info Text */}
          <Text style={styles.infoText}>
            We'll send you details in your email to get you back in.
          </Text>

          {/* Bottom Section - Continue Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[styles.continueButton, (!isValid || isLoading) && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={!isValid || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
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

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Google size={20} color={Colors.text} variant="Bold" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>

      {/* Error Modal */}
      <AlertModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        icon={errorMessage.icon}
        title={errorMessage.title}
        message={errorMessage.message}
        primaryButtonText="Got it"
      />

      {/* Google Coming Soon Modal */}
      <AlertModal
        visible={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        icon={<Google size={24} color={Colors.purple} variant="Bold" />}
        title="Coming soon!"
        message="Google Sign-In is on its way! For now, please use your email address or phone number to sign in."
        primaryButtonText="Sounds good"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  logoContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(32),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xxl,
    marginTop: Spacing.md,
  },
  emailInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  emailInput: {
    flex: 1,
    fontSize: normalize(20),
    color: Colors.text,
    padding: 0,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: normalize(14),
    color: '#FF6B6B',
    marginBottom: Spacing.sm,
    fontWeight: FontWeights.medium,
  },
  infoText: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    lineHeight: normalize(20),
    marginBottom: Spacing.xl,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
    marginTop: Spacing.xl,
  },
  continueButtonDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.transparent,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  googleButtonText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
