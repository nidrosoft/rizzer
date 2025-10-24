/**
 * QuickInsights Component
 * Displays personalized insights and reminders
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Cake, Edit, Calendar, MagicStar } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';

interface InsightItem {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  text: string;
  action?: string;
}

export default function QuickInsights() {
  const { showToast } = useToast();

  const insights: InsightItem[] = [
    {
      id: '1',
      icon: <Cake size={20} color="#FF6B9D" variant="Bold" />,
      iconColor: '#FF6B9D',
      iconBg: 'rgba(255, 107, 157, 0.15)',
      text: "Sarah's birthday in 5 days",
      action: 'View',
    },
    {
      id: '2',
      icon: <Edit size={20} color="#AB47BC" variant="Bold" />,
      iconColor: '#AB47BC',
      iconBg: 'rgba(171, 71, 188, 0.15)',
      text: '3 notes need review',
      action: 'Review',
    },
    {
      id: '3',
      icon: <Calendar size={20} color="#26C6DA" variant="Bold" />,
      iconColor: '#26C6DA',
      iconBg: 'rgba(38, 198, 218, 0.15)',
      text: 'You have 3 dates this week',
    },
    {
      id: '4',
      icon: <MagicStar size={20} color="#FFA726" variant="Bold" />,
      iconColor: '#FFA726',
      iconBg: 'rgba(255, 167, 38, 0.15)',
      text: 'Try these new conversation tips',
      action: 'Explore',
    },
  ];

  const handleInsightPress = (insight: InsightItem) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Show appropriate toast based on action
    let message = 'Action completed';
    if (insight.action === 'View') {
      message = 'Opening birthday details...';
    } else if (insight.action === 'Review') {
      message = 'Opening notes for review...';
    } else if (insight.action === 'Explore') {
      message = 'Loading conversation tips...';
    }
    showToast(message, 'info');
    
    console.log('Insight pressed:', insight.text);
  };

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.title}>Quick Insights</Text>
        <View style={styles.insightsList}>
          {insights.map((insight) => (
            <TouchableOpacity
              key={insight.id}
              style={styles.insightItem}
              onPress={() => handleInsightPress(insight)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: insight.iconBg }]}>
                {insight.icon}
              </View>
              <Text style={styles.insightText} numberOfLines={1} ellipsizeMode="tail">
                {insight.text}
              </Text>
              {insight.action && (
                <View style={styles.actionButton}>
                  <Text style={styles.actionText}>{insight.action}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
    borderRadius: BorderRadius.lg,
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
    marginBottom: Spacing.md,
  },
  insightsList: {
    gap: Spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  actionButton: {
    backgroundColor: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
});
