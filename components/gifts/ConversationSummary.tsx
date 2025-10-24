/**
 * ConversationSummary Component
 * Displays AI-generated conversation summary and key insights
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { QuoteUp, Heart, Star1, User } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { ConversationSummaryProps } from '@/types/gifts';
import SectionHeader from '@/components/ui/SectionHeader';

interface ExtendedConversationSummaryProps extends ConversationSummaryProps {
  highlights?: string[];
  interests?: string[];
  personality?: string[];
}

export default function ConversationSummary({ 
  summary, 
  insights,
  highlights = [],
  interests = [],
  personality = []
}: ExtendedConversationSummaryProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary Card */}
      <View style={styles.section}>
        <SectionHeader
          title="Conversation Summary"
          subtitle="AI-generated insights from your chat"
        />
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      </View>

      {/* Conversation Highlights */}
      {highlights.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="Key Quotes"
            subtitle="Important things they mentioned"
          />
          <View style={styles.highlightsContainer}>
            {highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightCard}>
                <View style={styles.quoteIcon}>
                  <QuoteUp size={16} color={GiftsConfig.gradient.start} variant="Bold" />
                </View>
                <Text style={styles.highlightText}>"{highlight}"</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Extracted Interests */}
      {interests.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="Interests & Hobbies"
            subtitle="What they're passionate about"
          />
          <View style={styles.tagsContainer}>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Heart size={14} color={Colors.gradientStart} variant="Bold" />
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Personality Insights */}
      {personality.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            title="Personality Traits"
            subtitle="How Sherlock reads them"
          />
          <View style={styles.tagsContainer}>
            {personality.map((trait, index) => (
              <View key={index} style={styles.personalityTag}>
                <Star1 size={14} color={Colors.purple} variant="Bold" />
                <Text style={styles.personalityText}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Key Insights */}
      <View style={styles.section}>
        <SectionHeader
          title="Key Insights"
          subtitle="What Sherlock learned about the recipient"
        />
        <View style={styles.insightsContainer}>
          {insights.map((insight) => (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Text style={styles.insightIconText}>{insight.icon}</Text>
              </View>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    backgroundColor: `${GiftsConfig.gradient.start}08`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: GiftsConfig.gradient.start,
  },
  summaryText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 24,
  },
  insightsContainer: {
    gap: Spacing.md,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${GiftsConfig.gradient.start}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  insightIconText: {
    fontSize: 20,
  },
  insightText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  highlightsContainer: {
    gap: Spacing.sm,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: GiftsConfig.gradient.start,
  },
  quoteIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  highlightText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.gradientStart}15`,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.gradientStart}30`,
  },
  interestText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.gradientStart,
  },
  personalityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.purple}15`,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.purple}30`,
  },
  personalityText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.purple,
  },
});
