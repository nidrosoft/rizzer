/**
 * ChatThreadList Component
 * List of chat threads grouped by date for Genius Rizz tab
 * Each time group has a unique color variant
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { ChatThreadListProps } from '@/types/rizz';

// 5 color variants for different time periods
const TIME_COLORS = {
  'Today': '#FF6B9D',           // Pink
  'Yesterday': '#AB47BC',        // Purple
  'Few Days Ago': '#26C6DA',    // Cyan
  'Last Month': '#66BB6A',      // Green
  'Last Year': '#FFA726',       // Orange
};

const getColorForTimeLabel = (timeLabel: string): string => {
  // Match exact time labels
  if (TIME_COLORS[timeLabel as keyof typeof TIME_COLORS]) {
    return TIME_COLORS[timeLabel as keyof typeof TIME_COLORS];
  }
  
  // Fallback logic for other time labels
  if (timeLabel.includes('day') || timeLabel.includes('Day')) {
    return TIME_COLORS['Few Days Ago'];
  }
  if (timeLabel.includes('month') || timeLabel.includes('Month')) {
    return TIME_COLORS['Last Month'];
  }
  if (timeLabel.includes('year') || timeLabel.includes('Year')) {
    return TIME_COLORS['Last Year'];
  }
  
  // Default to pink
  return TIME_COLORS['Today'];
};

export default function ChatThreadList({ chatGroups, onChatPress }: ChatThreadListProps) {
  const handlePress = (chatId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChatPress(chatId);
  };

  return (
    <View style={styles.container}>
      {chatGroups.map((group, groupIndex) => {
        const iconColor = getColorForTimeLabel(group.timeLabel);
        
        return (
          <View key={groupIndex} style={styles.group}>
            <Text style={styles.groupTitle}>{group.timeLabel}</Text>
            {group.chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatCard}
                activeOpacity={0.7}
                onPress={() => handlePress(chat.id)}
              >
                <View style={[styles.chatIcon, { backgroundColor: `${iconColor}15` }]}>
                  <Text style={styles.chatIconText}>💬</Text>
                </View>
                <View style={styles.chatContent}>
                  <Text style={styles.chatTitle} numberOfLines={1}>
                    {chat.title}
                  </Text>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                </View>
                <Text style={styles.chatArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  group: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  chatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  chatIconText: {
    fontSize: 24,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chatArrow: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
});
