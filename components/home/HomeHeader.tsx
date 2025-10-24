/**
 * HomeHeader Component
 * Header with user greeting and notification button
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Colors, Spacing, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { HomeHeaderProps } from '@/types/home';

export default function HomeHeader({ userName, onNotificationPress, onProfilePress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.profileBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileInner}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={styles.profilePicture}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.subGreeting}>Good Morning</Text>
          <Text style={styles.greeting}>{userName}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
        <Text style={styles.icon}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  profileBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
    ...Shadows.small,
  },
  profileInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerContent: {
    flex: 1,
  },
  subGreeting: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  greeting: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 20,
  },
});
