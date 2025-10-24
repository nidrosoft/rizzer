/**
 * Card Skeleton Component
 * Skeleton loader for card-based content
 */

import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { Spacing, BorderRadius } from '@/constants/theme';

interface CardSkeletonProps {
  showImage?: boolean;
  lines?: number;
}

export function CardSkeleton({ 
  showImage = true,
  lines = 3,
}: CardSkeletonProps) {
  return (
    <View style={styles.card}>
      {showImage && (
        <SkeletonLoader 
          height={200} 
          borderRadius={BorderRadius.lg} 
          style={styles.image}
        />
      )}
      <View style={styles.content}>
        <SkeletonLoader height={24} width="70%" style={styles.title} />
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonLoader 
            key={index}
            height={16} 
            width={index === lines - 1 ? '60%' : '90%'} 
            style={styles.line}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  image: {
    marginBottom: Spacing.sm,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  line: {
    marginBottom: Spacing.xs,
  },
});
