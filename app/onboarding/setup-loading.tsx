/**
 * Setup Loading Screen
 * Transitional screen showing account configuration
 * Animated steps before landing on dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { TickCircle, Profile, Calendar, Gift, SearchNormal1 } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useOnboardingStore } from '@/store/onboardingStore';

interface SetupStep {
  id: string;
  icon: any;
  title: string;
  duration: number;
}

const setupSteps: SetupStep[] = [
  {
    id: 'profile',
    icon: Profile,
    title: 'Setting up your profile',
    duration: 1500,
  },
  {
    id: 'events',
    icon: SearchNormal1,
    title: 'Finding best events for you',
    duration: 1500,
  },
  {
    id: 'dates',
    icon: Calendar,
    title: 'Loading date ideas',
    duration: 1200,
  },
  {
    id: 'gifts',
    icon: Gift,
    title: 'Preparing gift suggestions',
    duration: 1200,
  },
];

export default function SetupLoadingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  
  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Process steps
    processSteps();
  }, []);

  const processSteps = async () => {
    for (let i = 0; i < setupSteps.length; i++) {
      const step = setupSteps[i];
      
      // Haptic feedback
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      setCurrentStep(i);

      // Animate progress
      Animated.timing(progressAnim, {
        toValue: ((i + 1) / setupSteps.length) * 100,
        duration: step.duration,
        useNativeDriver: false,
      }).start();

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, step.duration));

      // Mark as completed
      setCompletedSteps(prev => [...prev, step.id]);

      // Success haptic
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }

    // All done - complete onboarding and navigate to dashboard
    try {
      await completeOnboarding();
      
      setTimeout(() => {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/tabs');
      }, 800);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to complete setup. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => completeOnboarding().then(() => router.replace('/tabs')),
          },
          {
            text: 'Skip',
            onPress: () => router.replace('/tabs'),
          },
        ]
      );
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#FAFAFA', '#F5F5F5']}
        style={styles.gradient}
      >
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoEmoji}>✨</Text>
          </LinearGradient>
        </View>

        {/* Main Title */}
        <Text style={styles.title}>Setting up your account</Text>
        <Text style={styles.subtitle}>This will only take a moment...</Text>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {setupSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;

            return (
              <View key={step.id} style={styles.stepRow}>
                {/* Icon */}
                <View style={[
                  styles.stepIcon,
                  isActive && styles.stepIconActive,
                  isCompleted && styles.stepIconCompleted,
                ]}>
                  {isCompleted ? (
                    <TickCircle size={24} color={Colors.textWhite} variant="Bold" />
                  ) : (
                    <Icon 
                      size={24} 
                      color={isActive ? Colors.textWhite : Colors.textSecondary} 
                      variant={isActive ? "Bold" : "Outline"}
                    />
                  )}
                </View>

                {/* Text */}
                <View style={styles.stepTextContainer}>
                  <Text style={[
                    styles.stepText,
                    isActive && styles.stepTextActive,
                    isCompleted && styles.stepTextCompleted,
                  ]}>
                    {step.title}
                  </Text>
                  {isActive && (
                    <View style={styles.loadingDots}>
                      <LoadingDots />
                    </View>
                  )}
                  {isCompleted && (
                    <Text style={styles.completedText}>✓ Done</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>
            {Math.round((progressAnim as any)._value)}%
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// Animated loading dots component
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  stepsContainer: {
    marginBottom: Spacing.xxl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepIconActive: {
    backgroundColor: Colors.purple,
  },
  stepIconCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  stepTextActive: {
    color: Colors.text,
    fontWeight: FontWeights.semibold,
  },
  stepTextCompleted: {
    color: Colors.textSecondary,
  },
  loadingDots: {
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purple,
  },
  completedText: {
    fontSize: FontSizes.xs,
    color: '#4CAF50',
    fontWeight: FontWeights.semibold,
    marginTop: 2,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.semibold,
  },
});
