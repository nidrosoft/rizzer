import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { TickCircle, Home, Eye } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useDateProfileCreationStore } from '@/store/dateProfileCreationStore';

export default function SuccessScreen() {
  const router = useRouter();
  const { draft, reset } = useDateProfileCreationStore();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const handleGoHome = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    reset(); // Clear the draft
    router.replace('/tabs');
  };

  const handleViewProfile = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    reset(); // Clear the draft
    // TODO: Navigate to date profiles list
    router.replace('/tabs');
  };

  const firstName = draft.first_name || 'their';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <TickCircle size={80} color={Colors.purple} variant="Bold" />
          </View>
        </View>

        {/* Title */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>🎉 Profile Created!</Text>
          <Text style={styles.subtitle}>
            You've unlocked the ultimate dating companion for {firstName}!
          </Text>
        </View>

        {/* Fun Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            ✨ Now you can:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>💬 Get personalized conversation starters</Text>
            <Text style={styles.feature}>🎁 Discover perfect gift ideas</Text>
            <Text style={styles.feature}>📅 Plan unforgettable dates</Text>
            <Text style={styles.feature}>💝 Track special moments together</Text>
            <Text style={styles.feature}>🎯 Build deeper connections</Text>
          </View>
          <Text style={styles.encouragement}>
            The more you add, the better we get at helping you create magical moments! 💫
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewProfile}
            activeOpacity={0.8}
          >
            <Eye size={24} color={Colors.purple} variant="Bold" />
            <Text style={styles.primaryButtonText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Home size={24} color={Colors.textWhite} variant="Bold" />
            <Text style={styles.secondaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gradientStart,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  message: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  featureList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  feature: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 22,
  },
  encouragement: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.purple,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
