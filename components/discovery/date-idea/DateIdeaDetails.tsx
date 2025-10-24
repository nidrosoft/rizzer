/**
 * Date Idea Details Component
 * Description, match reason, what to bring, and tips
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface DateIdeaDetailsProps {
  description: string;
  matchReason: string;
  whatToBring: string[];
  tips: string[];
}

export default function DateIdeaDetails({
  description,
  matchReason,
  whatToBring,
  tips,
}: DateIdeaDetailsProps) {
  return (
    <>
      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Date</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Match Reason */}
      <View style={styles.matchCard}>
        <Text style={styles.matchIcon}>✨</Text>
        <View style={styles.matchContent}>
          <Text style={styles.matchTitle}>Why This Works</Text>
          <Text style={styles.matchReason}>{matchReason}</Text>
        </View>
      </View>

      {/* What to Bring */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What to Bring</Text>
        {whatToBring.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pro Tips</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    lineHeight: normalize(24),
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: `${Colors.purple}10`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: `${Colors.purple}30`,
  },
  matchIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  matchContent: {
    flex: 1,
  },
  matchTitle: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.purple,
    marginBottom: 4,
  },
  matchReason: {
    fontSize: normalize(14),
    color: Colors.text,
    lineHeight: normalize(20),
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  bullet: {
    fontSize: normalize(16),
    color: Colors.purple,
    marginRight: Spacing.sm,
    fontWeight: FontWeights.bold,
  },
  listText: {
    flex: 1,
    fontSize: normalize(16),
    color: Colors.text,
    lineHeight: normalize(22),
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: normalize(14),
    color: Colors.text,
    lineHeight: normalize(20),
  },
});
