import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function AuthWelcomeScreen() {
  const router = useRouter();

  const socialButtons = [
    { name: 'Google', icon: 'G', label: 'Continue with Google', bgColor: '#FFFFFF', textColor: '#757575', iconColor: '#DB4437', hasBorder: true },
    { name: 'Apple', icon: '🍎', label: 'Continue with Apple', bgColor: '#000000', textColor: '#FFFFFF', iconColor: '#FFFFFF', hasBorder: false },
    { name: 'Phone', icon: '📱', label: 'Continue with Phone', bgColor: '#6C63FF', textColor: '#FFFFFF', iconColor: '#FFFFFF', hasBorder: false },
  ];

  const handleSocialLogin = (method: string) => {
    if (method === 'Email') {
      router.push('/auth/signup');
    } else if (method === 'Phone') {
      router.push('/auth/phone');
    } else {
      // Handle Google login
      console.log(`Login with ${method}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.heartIcon}>❤️</Text>
            </LinearGradient>
          </View>
          <Text style={styles.brandName}>Rizzer</Text>
          <Text style={styles.tagline}>Your AI-Powered Dating Coach</Text>
        </View>

        {/* Main Sign Up Button */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push('/auth/signup')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.signUpGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.logInButton}
            onPress={() => router.push('/auth/signin')}
            activeOpacity={0.7}
          >
            <Text style={styles.logInText}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Options */}
        <View style={styles.socialSection}>
          {socialButtons.map((social) => (
            <TouchableOpacity
              key={social.name}
              style={[
                styles.socialButton, 
                { backgroundColor: social.bgColor },
                social.hasBorder && styles.socialButtonBorder
              ]}
              onPress={() => handleSocialLogin(social.name)}
              activeOpacity={0.8}
            >
              <View style={styles.socialIconContainer}>
                <Text style={[styles.socialIcon, { color: social.iconColor }]}>{social.icon}</Text>
              </View>
              <Text style={[styles.socialLabel, { color: social.textColor }]}>{social.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.footerLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 50,
  },
  brandName: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionsSection: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  signUpButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    height: 56,
  },
  signUpGradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  logInButton: {
    height: 56,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.purple,
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  socialSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  socialButtonBorder: {
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  socialIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: FontWeights.bold,
  },
  socialLabel: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: Spacing.lg,
  },
  footerText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
});
