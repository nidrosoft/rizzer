/**
 * AI Date Planner - Step 3: AI Generating Itinerary
 * Animated loading screen while AI creates the perfect date plan
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { MagicStar } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

const GENERATION_STAGES = [
  { id: 1, text: 'Analyzing your preferences...', duration: 2000 },
  { id: 2, text: 'Finding perfect spots in your area...', duration: 2500 },
  { id: 3, text: 'Creating your personalized itinerary...', duration: 2000 },
  { id: 4, text: 'Adding insider tips and recommendations...', duration: 1500 },
];

export default function Step3Generating() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progress, {
      toValue: 100,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    // Stage progression with haptic feedback
    let currentIndex = 0;
    const stageInterval = setInterval(() => {
      if (currentIndex < GENERATION_STAGES.length - 1) {
        currentIndex++;
        setCurrentStage(currentIndex);
        // Heavy haptic feedback for each stage
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }
    }, 2000);

    // Navigate to results after completion
    const navigationTimeout = setTimeout(() => {
      router.replace({
        pathname: '/discovery/date-planner/step4-itinerary',
        params,
      });
    }, 8000);

    return () => {
      clearInterval(stageInterval);
      clearTimeout(navigationTimeout);
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <LinearGradient
      colors={['#FE3C72', '#FF7854']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Animated Icon */}
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }, { rotate: rotation }] }]}>
            <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />
            <MagicStar size={80} color={Colors.textWhite} variant="Bold" />
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Creating Your Perfect Date</Text>

          {/* Current Stage */}
          <View style={styles.stageContainer}>
            {GENERATION_STAGES.map((stage, index) => (
              <View key={stage.id} style={styles.stageRow}>
                <View style={[
                  styles.stageDot,
                  index <= currentStage && styles.stageDotActive,
                ]} />
                <Text style={[
                  styles.stageText,
                  index === currentStage && styles.stageTextActive,
                  index < currentStage && styles.stageTextCompleted,
                ]}>
                  {stage.text}
                </Text>
                {index < currentStage && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            ))}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressText}>This will only take a moment...</Text>
          </View>

          {/* Fun Fact */}
          <View style={styles.tipContainer}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Did you know? AI analyzes over 1,000 date spots to find the perfect match for you!
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  stageContainer: {
    width: '100%',
    marginBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stageDotActive: {
    backgroundColor: Colors.textWhite,
  },
  stageText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  stageTextActive: {
    color: Colors.textWhite,
    fontWeight: FontWeights.semibold,
  },
  stageTextCompleted: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkmark: {
    fontSize: 18,
    color: Colors.textWhite,
  },
  progressContainer: {
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.textWhite,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: Spacing.lg,
    borderRadius: 16,
    gap: Spacing.md,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textWhite,
    lineHeight: 20,
  },
});
