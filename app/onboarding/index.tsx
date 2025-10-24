import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

export default function OnboardingWelcome() {
  const router = useRouter();

  const features = [
    { icon: '💬', title: 'AI-Powered Conversations', description: 'Get smart suggestions for your chats' },
    { icon: '📅', title: 'Date Management', description: 'Keep track of all your connections' },
    { icon: '🎯', title: 'Personalized Tips', description: 'Improve your dating game' },
    { icon: '🎉', title: 'Event Discovery', description: 'Find exciting places to meet' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heartIcon}>❤️</Text>
          </LinearGradient>
          <Text style={styles.title}>Welcome to Rizzer</Text>
          <Text style={styles.subtitle}>
            Your AI-powered dating coach that helps you connect better
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding/name')}
            size="large"
            fullWidth
          />
          <Text style={styles.footerText}>
            This will only take a few minutes
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heartIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    flex: 1,
    gap: Spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundGray,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  footer: {
    paddingVertical: Spacing.lg,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
