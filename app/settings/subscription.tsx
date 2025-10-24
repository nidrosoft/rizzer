/**
 * Subscription Settings Page
 * Manage subscription plan and billing
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import { 
  Crown,
  TickCircle,
  Flash,
  MessageText1,
  Calendar,
  Gift,
  Discover,
  Star1,
} from 'iconsax-react-native';
import { Colors, Spacing, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function SubscriptionSettings() {
  const router = useRouter();
  const [currentPlan] = useState('pro'); // 'free' or 'pro'

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleUpgrade = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // TODO: Navigate to upgrade flow
    console.log('Upgrade to Pro');
  };

  const handleManageBilling = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Navigate to billing management
    console.log('Manage billing');
  };

  const proFeatures = [
    { icon: Flash, label: 'Unlimited Rizz Lines' },
    { icon: MessageText1, label: 'AI Chat Assistant' },
    { icon: Calendar, label: 'Advanced Date Planning' },
    { icon: Gift, label: 'Gift Investigation' },
    { icon: Discover, label: 'Premium Events Access' },
    { icon: Star1, label: 'Priority Support' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Plan Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          <View style={styles.planCard}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.planGradient}
            >
              <View style={styles.planHeader}>
                <Crown size={32} color={Colors.textWhite} variant="Bold" />
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.planName}>Rizzers Pro</Text>
              <Text style={styles.planPrice}>$9.99/month</Text>
              <Text style={styles.planRenewal}>Renews on Dec 23, 2025</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Pro Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pro Features</Text>
          <View style={styles.featuresCard}>
            {proFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Icon size={20} color={Colors.purple} variant="Bold" />
                  </View>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                  <TickCircle size={20} color={Colors.success || Colors.purple} variant="Bold" />
                </View>
              );
            })}
          </View>
        </View>

        {/* Billing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.billingRow}
              onPress={handleManageBilling}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.billingLabel}>Payment Method</Text>
                <Text style={styles.billingValue}>•••• •••• •••• 4242</Text>
              </View>
              <Text style={styles.billingLink}>Change</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.billingRow}
              onPress={handleManageBilling}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.billingLabel}>Billing History</Text>
                <Text style={styles.billingValue}>View past invoices</Text>
              </View>
              <Text style={styles.billingLink}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cancel Subscription */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => console.log('Cancel subscription')}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your subscription will automatically renew unless cancelled at least 24 hours before the end of the current period.
          </Text>
        </View>
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
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  planCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  planGradient: {
    padding: Spacing.xl,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  planBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: normalize(11),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  planName: {
    fontSize: normalize(28),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: normalize(20),
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
    marginBottom: Spacing.xs,
  },
  planRenewal: {
    fontSize: normalize(13),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.purple}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureLabel: {
    flex: 1,
    fontSize: normalize(15),
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  billingLabel: {
    fontSize: normalize(15),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  billingValue: {
    fontSize: normalize(13),
    color: Colors.textSecondary,
  },
  billingLink: {
    fontSize: normalize(15),
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cancelText: {
    fontSize: normalize(15),
    fontWeight: FontWeights.semibold,
    color: Colors.error,
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  infoText: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
    lineHeight: normalize(18),
    textAlign: 'center',
  },
});
