/**
 * RizzLoadingCard Component
 * Beautiful loading animation for AI-generated rizz lines
 * Shows shimmer effect with typing dots
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { MagicStar } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function RizzLoadingCard() {
  // Animation values
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer animation (left to right sweep)
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // Typing dots animation (sequential bounce)
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot1Anim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.delay(300),
      ])
    ).start();

    // Pulse animation (gentle breathing effect)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
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

    // Sparkle rotation
    Animated.loop(
      Animated.timing(sparkleRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const dot1Scale = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const dot2Scale = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const dot3Scale = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const sparkleRotation = sparkleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: pulseAnim }] }]}>
      {/* Shimmer overlay */}
      <View style={styles.shimmerContainer}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Sparkle icon */}
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: sparkleRotation }] }]}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MagicStar size={20} color={Colors.textWhite} variant="Bold" />
          </LinearGradient>
        </Animated.View>

        {/* Loading text */}
        <View style={styles.textContainer}>
          <Text style={styles.loadingText}>AI is crafting your rizz</Text>
          
          {/* Typing dots */}
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: dot2Scale }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
          </View>
        </View>
      </View>

      {/* Skeleton lines (placeholder for text) */}
      <View style={styles.skeletonContainer}>
        <View style={[styles.skeletonLine, { width: '90%' }]} />
        <View style={[styles.skeletonLine, { width: '75%' }]} />
        <View style={[styles.skeletonLine, { width: '60%' }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmer: {
    width: 300,
    height: '100%',
  },
  shimmerGradient: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.semibold,
    marginRight: Spacing.xs,
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
  skeletonContainer: {
    gap: Spacing.xs,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 6,
  },
});
