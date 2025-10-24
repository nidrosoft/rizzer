/**
 * List Skeleton Component
 * Skeleton loader for list items
 */

import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { Spacing, BorderRadius } from '@/constants/theme';

interface ListSkeletonProps {
  count?: number;
  showAvatar?: boolean;
}

export function ListSkeleton({ 
  count = 5,
  showAvatar = true,
}: ListSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.item}>
          {showAvatar && (
            <SkeletonLoader 
              width={48} 
              height={48} 
              borderRadius={9999}
              style={styles.avatar}
            />
          )}
          <View style={styles.content}>
            <SkeletonLoader height={20} width="60%" style={styles.title} />
            <SkeletonLoader height={16} width="80%" />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
});
