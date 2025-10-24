/**
 * Terms & Conditions Settings
 * View legal documents
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import BackButton from '@/components/ui/BackButton';
import { Colors, Spacing, FontWeights } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

export default function TermsSettings() {
  const router = useRouter();

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoBox}>
          <Text style={styles.version}>Version 1.0</Text>
          <Text style={styles.lastUpdated}>Last updated: October 23, 2024</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using Rizzers, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>

          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily download one copy of Rizzers for personal, non-commercial transitory viewing only.
          </Text>

          <Text style={styles.sectionTitle}>3. User Account</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.
          </Text>

          <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Your use of Rizzers is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
          </Text>

          <Text style={styles.sectionTitle}>5. Prohibited Uses</Text>
          <Text style={styles.paragraph}>
            You may not use Rizzers for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.
          </Text>

          <Text style={styles.sectionTitle}>6. Modifications</Text>
          <Text style={styles.paragraph}>
            Rizzers reserves the right to modify or replace these Terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
          </Text>

          <Text style={styles.sectionTitle}>7. Contact Information</Text>
          <Text style={styles.paragraph}>
            Questions about the Terms of Service should be sent to us at support@rizzers.app
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
    paddingHorizontal: Spacing.lg,
  },
  infoBox: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  version: {
    fontSize: normalize(14),
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
    marginBottom: Spacing.xs,
  },
  lastUpdated: {
    fontSize: normalize(12),
    color: Colors.textSecondary,
  },
  content: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
    lineHeight: normalize(20),
    marginBottom: Spacing.md,
  },
});
