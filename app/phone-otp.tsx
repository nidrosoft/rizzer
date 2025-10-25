import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldTick, CloseSquare, TickCircle, ArrowRight, Clock, Danger, InfoCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize, horizontalScale } from '@/utils/responsive';
import { useAuthStore } from '@/store/authStore';
import { sendOTP } from '@/lib/auth';
import AlertModal from '@/components/ui/AlertModal';

export default function PhoneOTPScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; message: string; icon: React.ReactNode }>({ 
    title: '', 
    message: '', 
    icon: null 
  });
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const login = useAuthStore((state) => state.login);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Get error message with icon for OTP errors
  const getOTPErrorMessage = (error: string) => {
    const errorLower = error.toLowerCase();
    
    // Expired token
    if (errorLower.includes('expired') || errorLower.includes('token') || timeLeft === 0) {
      return {
        icon: <Clock size={24} color="#FF6B6B" variant="Bold" />,
        title: 'Time\'s up!',
        message: 'Your code took a little vacation and expired. No worries though,just hit resend and we\'ll send you a fresh one!'
      };
    }
    
    // Invalid/wrong code
    if (errorLower.includes('invalid') || errorLower.includes('incorrect') || errorLower.includes('wrong') || errorLower.includes('otp')) {
      return {
        icon: <Danger size={24} color="#FF6B6B" variant="Bold" />,
        title: 'Hmm, that\'s not it...',
        message: 'The code you entered doesn\'t match what we sent. Double-check those digits and give it another shot!'
      };
    }
    
    // Too many attempts
    if (errorLower.includes('too many') || errorLower.includes('attempts')) {
      return {
        icon: <InfoCircle size={24} color="#FF6B6B" variant="Bold" />,
        title: 'Whoa there!',
        message: 'Too many tries! Take a quick breather, then request a new code and try again.'
      };
    }
    
    // Default
    return {
      icon: <Danger size={24} color="#FF6B6B" variant="Bold" />,
      title: 'Oops, something went wrong',
      message: 'We couldn\'t verify that code. Mind trying again?'
    };
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    // Validate OTP is complete
    if (otpCode.length !== 6) {
      return;
    }

    setIsLoading(true);
    console.log('🔐 [OTP-VERIFY] Starting verification...');

    try {
      // Verify OTP and login via Supabase
      console.log('🔐 [OTP-VERIFY] Calling login with phone:', phoneNumber);
      await login(phoneNumber as string, otpCode);
      console.log('✅ [OTP-VERIFY] Login successful');

      // Wait for auth store to fully update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get user to check onboarding status
      const user = useAuthStore.getState().user;
      console.log('👤 [OTP-VERIFY] User after login:', user);

      if (!user || !user.id) {
        throw new Error('User not found after login. Please try again.');
      }

      if (user?.name) {
        // User has completed onboarding - go to home
        console.log('✅ [OTP-VERIFY] User has name, going to tabs');
        router.replace('/tabs');
      } else {
        // New user - go to onboarding
        console.log('📝 [OTP-VERIFY] New user, going to onboarding');
        router.replace('/onboarding-welcome');
      }
    } catch (error: any) {
      console.error('❌ [OTP-VERIFY] Verification failed:', error);
      
      // Show error modal with icon
      const errorDetails = getOTPErrorMessage(error.message || '');
      setErrorMessage(errorDetails);
      setShowErrorModal(true);
      
      // Clear OTP and focus first input
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
      console.log('🏁 [OTP-VERIFY] Verification process complete');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);

    try {
      const { success, error } = await sendOTP(phoneNumber as string);

      if (success) {
        Alert.alert(
          'Code Sent',
          'A new verification code has been sent to your phone.',
          [{ text: 'OK' }]
        );
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        // Reset timer
        setTimeLeft(60);
        setCanResend(false);
      } else {
        Alert.alert(
          'Error',
          error || 'Failed to resend code. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <CloseSquare size={28} color={Colors.text} variant="Outline" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <ShieldTick size={28} color={Colors.text} variant="Outline" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Enter your verification code</Text>

        {/* Subtitle with Edit */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Sent to {phoneNumber}</Text>
          <Text style={styles.dot}> • </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* First digit check */}
        {otp[0] && (
          <View style={styles.checkContainer}>
            <TickCircle size={20} color={Colors.success || Colors.purple} variant="Bold" />
          </View>
        )}

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpInputWrapper}>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpTextInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                caretHidden={false}
              />
              <View style={[styles.otpUnderline, digit && styles.otpUnderlineFilled]} />
            </View>
          ))}
        </View>

        {/* Bottom Section - Resend Link and Continue Button */}
        <View style={styles.bottomSection}>
          <View style={styles.resendContainer}>
            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleResend}
              disabled={!canResend || isResending}
            >
              {isResending ? (
                <ActivityIndicator size="small" color={Colors.purple} />
              ) : (
                <>
                  <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
                    {canResend ? 'Resend code' : "Didn't get a code?"}
                  </Text>
                  {!canResend && (
                    <View style={styles.timerBadge}>
                      <Clock size={14} color={timeLeft > 10 ? Colors.purple : '#FF6B6B'} variant="Bold" />
                      <Text style={[styles.timerBadgeText, timeLeft <= 10 && styles.timerTextWarning]}>
                        {timeLeft}s
                      </Text>
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, (!isComplete || isLoading) && styles.continueButtonDisabled]}
            onPress={handleVerify}
            disabled={!isComplete || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <ArrowRight 
                size={28} 
                color={isComplete ? Colors.background : Colors.border} 
                variant="Outline"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Modal - Using AlertModal */}
      <AlertModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        icon={errorMessage.icon}
        title={errorMessage.title}
        message={errorMessage.message}
        primaryButtonText="Got it!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
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
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  subtitle: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
  },
  dot: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
  },
  editLink: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  timerText: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  timerTextWarning: {
    color: '#FF6B6B',
  },
  checkContainer: {
    marginBottom: Spacing.md,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  otpInputWrapper: {
    alignItems: 'center',
    width: horizontalScale(50),
  },
  otpTextInput: {
    fontSize: normalize(24),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    width: horizontalScale(50),
    height: horizontalScale(50),
    padding: 0,
  },
  otpUnderline: {
    width: horizontalScale(50),
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  otpUnderlineFilled: {
    backgroundColor: Colors.text,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  resendContainer: {
    flex: 1,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: 4,
  },
  resendText: {
    fontSize: normalize(14),
    color: Colors.purple,
    fontWeight: FontWeights.medium,
  },
  resendTextDisabled: {
    color: Colors.textSecondary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  timerBadgeText: {
    fontSize: normalize(12),
    fontWeight: FontWeights.bold,
    color: Colors.purple,
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
});
