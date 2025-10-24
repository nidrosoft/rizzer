/**
 * DateProfilesLoading Component
 * Loading skeleton for date profiles gallery
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function DateProfilesLoading() {
  // Shimmer animation
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSkeleton} />
        <View style={styles.buttonSkeleton} />
      </View>
      
      <View style={styles.cardsContainer}>
        {[1, 2, 3].map((index) => (
          <Animated.View
            key={index}
            style={[styles.cardSkeleton, { opacity }]}
          >
            <View style={styles.imageSkeleton} />
            <View style={styles.textContainer}>
              <View style={styles.nameSkeleton} />
              <View style={styles.professionSkeleton} />
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  titleSkeleton: {
    width: 140,
    height: 28,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
  },
  buttonSkeleton: {
    width: 80,
    height: 32,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  cardSkeleton: {
    width: 160,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  imageSkeleton: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.borderLight,
  },
  textContainer: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  nameSkeleton: {
    width: '70%',
    height: 18,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
  },
  professionSkeleton: {
    width: '50%',
    height: 14,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
  },
});
