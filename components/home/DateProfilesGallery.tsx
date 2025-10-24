/**
 * DateProfilesGallery Component
 * Horizontal scrollable date profile cards with add new profile button
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { DateProfilesSectionProps } from '@/types/home';
import DateProfileCard from '@/components/DateProfileCard';

export default function DateProfilesGallery({
  profiles,
  onNewProfile,
  onProfilePress,
}: DateProfilesSectionProps) {
  const handleNewProfile = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onNewProfile();
  };

  const handleProfilePress = (profileId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onProfilePress(profileId);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Date Profiles</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={handleNewProfile}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.newButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.newButtonText}>+ New</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {profiles.length === 0 ? (
        // Empty State
        <View style={styles.emptyStateCard}>
          <Image
            source={require('@/assets/images/dateprofile.png')}
            style={styles.emptyStateImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyStateTitle}>No Date Profiles Yet</Text>
          <Text style={styles.emptyStateDescription}>
            Create your first date profile to start tracking and managing your dating connections
          </Text>
          <TouchableOpacity
            style={styles.newDateButton}
            activeOpacity={0.8}
            onPress={handleNewProfile}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.newDateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.newDateButtonText}>+ New Date Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        // Filled State with Profile Cards
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.profilesScroll}
          decelerationRate="fast"
          snapToInterval={202}
          snapToAlignment="start"
        >
          {profiles.map((profile) => (
            <DateProfileCard
              key={profile.id}
              profile={profile}
              onPress={() => handleProfilePress(profile.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  newButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  newButtonGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  newButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  emptyStateCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: Spacing.md,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyStateDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  newDateButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    minWidth: 160,
  },
  newDateGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newDateButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  profilesScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
});
