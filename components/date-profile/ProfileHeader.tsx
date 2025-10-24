/**
 * ProfileHeader Component
 * Header with profile photo, name, and action buttons
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { DateProfileHeaderProps } from '@/types/dateProfile';
import { getRelationshipStatusLabel } from '@/data/dateProfileData';

export default function ProfileHeader({ profile, onBack, onEdit }: DateProfileHeaderProps) {
  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onBack();
  };

  const handleEdit = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onEdit();
  };

  return (
    <View style={styles.container}>
      {/* Main Profile Card */}
      <View style={styles.profileCard}>
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.photoBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.photoInner}>
              <Image source={{ uri: profile.basicInfo.photo }} style={styles.photo} />
            </View>
          </LinearGradient>
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {profile.basicInfo.name}, {profile.basicInfo.age}
          </Text>
          <Text style={styles.profession}>{profile.basicInfo.profession}</Text>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusBadge}
          >
            <Text style={styles.statusText}>
              {getRelationshipStatusLabel(profile.basicInfo.status)}
            </Text>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stats.daysTogether}</Text>
            <Text style={styles.statLabel}>Days Together</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stats.totalDates}</Text>
            <Text style={styles.statLabel}>Dates</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stats.memoriesCount}</Text>
            <Text style={styles.statLabel}>Memories</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  profileCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  photoContainer: {
    marginBottom: Spacing.lg,
  },
  photoBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
  },
  photoInner: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  photo: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  name: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  profession: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
