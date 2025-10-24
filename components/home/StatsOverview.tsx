/**
 * StatsOverview Component
 * Displays user activity statistics at a glance
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Profile2User, Messages2, Calendar, Chart } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface StatItemProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}

function StatItem({ icon, iconBg, value, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsOverview() {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <StatItem
            icon={<Profile2User size={24} color="#FF6B9D" variant="Bold" />}
            iconBg="rgba(255, 107, 157, 0.15)"
            value="5"
            label="Profiles"
          />
          <StatItem
            icon={<Messages2 size={24} color="#AB47BC" variant="Bold" />}
            iconBg="rgba(171, 71, 188, 0.15)"
            value="24"
            label="Rizz Lines"
          />
          <StatItem
            icon={<Calendar size={24} color="#26C6DA" variant="Bold" />}
            iconBg="rgba(38, 198, 218, 0.15)"
            value="3"
            label="Dates"
          />
          <StatItem
            icon={<Chart size={24} color="#66BB6A" variant="Bold" />}
            iconBg="rgba(102, 187, 106, 0.15)"
            value="89%"
            label="Success"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
