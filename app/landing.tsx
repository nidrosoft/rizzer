import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Call, Google } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const insets = useSafeAreaInsets();

  const handlePhoneSignup = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/phone-entry');
  };

  const handleGoogleSignup = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Implement Google Sign-In
    // For now, show alert or navigate to phone entry as fallback
    alert('Google Sign-In coming soon! Please use phone number for now.');
  };

  const handleSignIn = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/phone-signin');
  };

  return (
    <View style={styles.container}>
      {/* Background Video - Full Screen */}
      <Video
        ref={videoRef}
        source={require('@/assets/images/landing.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        onLoad={() => setIsVideoReady(true)}
      />
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        style={styles.overlay}
      >
        <View style={[styles.content, {
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom + Spacing.md,
        }]}>
            {/* Top Section - Logo & Tagline */}
            <View style={styles.topSection}>
              <Text style={styles.logo}>Rizzers</Text>
              <Text style={styles.tagline}>Elevate Your Dating Game</Text>
            </View>

            {/* Middle Section - Hero Text */}
            <View style={styles.middleSection}>
              <Text style={styles.heroTitle}>Your AI Dating Wingman</Text>
              <Text style={styles.heroSubtitle}>
                Master conversations, plan perfect dates, and find thoughtful gifts.{'\n'}
                Elevate every moment of your dating journey.
              </Text>
            </View>

            {/* Bottom Section - CTA Buttons */}
            <View style={styles.bottomSection}>
              {/* Phone Number Button (Primary) */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handlePhoneSignup}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Call size={24} color={Colors.textWhite} variant="Bold" />
                  <Text style={styles.primaryButtonText}>Sign up with Phone Number</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Easy Signup Text */}
              <Text style={styles.easyText}>
                ✨ Quick & easy - no hassle, just your phone number
              </Text>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Button (Secondary) */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGoogleSignup}
                activeOpacity={0.8}
              >
                <Google size={24} color={Colors.text} variant="Bold" />
                <Text style={styles.secondaryButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* Already Have Account */}
              <TouchableOpacity style={styles.loginLink} onPress={handleSignIn}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Text style={styles.loginTextBold}>Sign In</Text>
              </TouchableOpacity>

              {/* Terms & Privacy */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms</Text>
                  {'. '}See how we use your data in our{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.text,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    // Padding handled dynamically with insets
  },
  topSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  logo: {
    fontSize: normalize(42),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: normalize(14),
    color: Colors.textWhite,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  heroTitle: {
    fontSize: normalize(36),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: normalize(42),
  },
  heroSubtitle: {
    fontSize: normalize(14),
    color: Colors.textWhite,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: normalize(22),
    paddingHorizontal: Spacing.lg,
    maxWidth: '90%',
  },
  bottomSection: {
    paddingBottom: Spacing.lg,
  },
  primaryButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  primaryButtonText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  easyText: {
    fontSize: normalize(11),
    color: Colors.textWhite,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textWhite,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: normalize(14),
    color: Colors.textWhite,
    opacity: 0.7,
    marginHorizontal: Spacing.md,
    fontWeight: FontWeights.medium,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  secondaryButtonText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  loginText: {
    fontSize: normalize(14),
    color: Colors.textWhite,
    opacity: 0.8,
  },
  loginTextBold: {
    fontSize: normalize(14),
    color: Colors.textWhite,
    fontWeight: FontWeights.bold,
  },
  termsContainer: {
    paddingHorizontal: Spacing.md,
  },
  termsText: {
    fontSize: normalize(11),
    color: Colors.textWhite,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: normalize(18),
  },
  termsLink: {
    fontWeight: FontWeights.semibold,
    textDecorationLine: 'underline',
  },
});
