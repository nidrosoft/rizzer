/**
 * Interests & Hobbies Settings
 * Manage user interests for personalization
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import SettingSection from '@/components/settings/SettingSection';
import { Add } from 'iconsax-react-native';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

const predefinedInterests = [
  { id: '1', name: 'Sports', emoji: '⚽' },
  { id: '2', name: 'Music', emoji: '🎵' },
  { id: '3', name: 'Movies', emoji: '🎬' },
  { id: '4', name: 'Travel', emoji: '✈️' },
  { id: '5', name: 'Food', emoji: '🍕' },
  { id: '6', name: 'Art', emoji: '🎨' },
  { id: '7', name: 'Reading', emoji: '📚' },
  { id: '8', name: 'Gaming', emoji: '🎮' },
  { id: '9', name: 'Fitness', emoji: '💪' },
  { id: '10', name: 'Photography', emoji: '📸' },
  { id: '11', name: 'Cooking', emoji: '👨‍🍳' },
  { id: '12', name: 'Nature', emoji: '🌿' },
];

export default function InterestsSettings() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['1', '2', '5']);

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const toggleInterest = (id: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Interests & Hobbies</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Select your interests to help us personalize your experience and suggest better dates
          </Text>
        </View>

        <SettingSection title="Your Interests">
          <View style={styles.interestsGrid}>
            {predefinedInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  onPress={() => toggleInterest(interest.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                  <Text style={[styles.interestName, isSelected && styles.interestNameSelected]}>
                    {interest.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SettingSection>

        <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
          <Add size={20} color={Colors.purple} variant="Bold" />
          <Text style={styles.addButtonText}>Add Custom Interest</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  infoBox: {
    backgroundColor: `${Colors.purple}15`,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.purple,
  },
  infoText: {
    fontSize: normalize(13),
    color: Colors.text,
    lineHeight: normalize(18),
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  interestChipSelected: {
    backgroundColor: `${Colors.purple}15`,
    borderColor: Colors.purple,
  },
  interestEmoji: {
    fontSize: 18,
  },
  interestName: {
    fontSize: normalize(14),
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  interestNameSelected: {
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.purple,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
