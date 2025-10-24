import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Input from '@/components/forms/Input';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const socialButtons = [
    { name: 'Google', icon: 'G', label: 'Continue with Google', bgColor: '#FFFFFF', textColor: '#757575', iconColor: '#DB4437', hasBorder: true },
    { name: 'Apple', icon: '🍎', label: 'Continue with Apple', bgColor: '#000000', textColor: '#FFFFFF', iconColor: '#FFFFFF', hasBorder: false },
    { name: 'Phone', icon: '📱', label: 'Continue with Phone', bgColor: '#6C63FF', textColor: '#FFFFFF', iconColor: '#FFFFFF', hasBorder: false },
  ];

  const handleSignUp = () => {
    // TODO: Implement signup logic
    router.push('/auth/phone');
  };

  const handleSocialLogin = (method: string) => {
    if (method === 'Phone') {
      router.push('/auth/phone');
    } else {
      console.log(`Login with ${method}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={<Text style={styles.inputIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            icon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={<Text style={styles.inputIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.continueGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
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
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => router.push('/auth/signin')}
            >
              Sign In
            </Text>
          </Text>
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
  header: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  inputIcon: {
    fontSize: 20,
  },
  continueButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    height: 56,
    marginTop: Spacing.md,
  },
  continueGradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
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
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  footerLink: {
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
});
