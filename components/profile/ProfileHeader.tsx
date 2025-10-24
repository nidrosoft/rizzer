/**
 * Profile Header Component
 * Profile picture, name, email, and member badge
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Colors, Spacing, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface ProfileHeaderProps {
  name: string;
  email: string;
  memberSince: string;
  profileImage?: string;
}

export default function ProfileHeader({
  name,
  email,
  memberSince,
  profileImage = 'https://i.pravatar.cc/150?img=12',
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.profileBorder}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileInner}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profilePicture}
          />
        </View>
      </LinearGradient>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <View style={styles.badge}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.badgeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.badgeText}>Member since {memberSince}</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  profileBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
    ...Shadows.medium,
  },
  profileInner: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  name: {
    fontSize: normalize(28),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  email: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  badge: {
    marginTop: Spacing.md,
  },
  badgeGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
});
