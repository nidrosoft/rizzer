/**
 * AnalysisProgress Component
 * Shows AI analysis progress with animated indicators
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { SearchNormal1, MagicStar, TickCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { AnalysisProgress as AnalysisProgressType } from '@/types/gifts';

interface AnalysisProgressProps {
  progress: AnalysisProgressType;
}

export default function AnalysisProgress({ progress }: AnalysisProgressProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for icon
    if (progress.stage !== 'completed') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [progress.stage]);

  useEffect(() => {
    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: progress.progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress.progress]);

  const getIcon = () => {
    switch (progress.stage) {
      case 'analyzing':
        return <SearchNormal1 size={32} color={Colors.textWhite} variant="Bold" />;
      case 'generating':
        return <MagicStar size={32} color={Colors.textWhite} variant="Bold" />;
      case 'completed':
        return <TickCircle size={32} color={Colors.textWhite} variant="Bold" />;
    }
  };

  const getStageLabel = () => {
    switch (progress.stage) {
      case 'analyzing':
        return 'Analyzing Information';
      case 'generating':
        return 'Generating Suggestions';
      case 'completed':
        return 'Analysis Complete';
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Icon Container */}
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.iconCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {getIcon()}
        </LinearGradient>
      </Animated.View>

      {/* Stage Label */}
      <Text style={styles.stageLabel}>{getStageLabel()}</Text>

      {/* Message */}
      <Text style={styles.message}>{progress.message}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={{ width: progressWidth }}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.progressBar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </View>

      {/* Percentage */}
      <Text style={styles.percentage}>{Math.round(progress.progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.gradientStart,
  },
});
