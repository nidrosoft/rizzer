/**
 * ChatMessage Component
 * Displays a single chat message (user or AI)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import Markdown from 'react-native-markdown-display';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.isUser) {
    return (
      <View style={styles.userMessageContainer}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.userMessageBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.userMessageText}>{message.text}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.aiMessageContainer}>
      <View style={styles.aiMessageBubble}>
        <Markdown style={markdownStyles}>{message.text}</Markdown>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: Spacing.md,
  },
  userMessageBubble: {
    backgroundColor: Colors.gradientStart,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  userMessageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: Colors.textWhite,
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginBottom: Spacing.md,
  },
  aiMessageBubble: {
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
  },
});

// Markdown styles for AI messages
const markdownStyles = {
  body: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: Colors.text,
  },
  heading1: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  heading2: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  strong: {
    fontWeight: FontWeights.bold,
    color: Colors.text, // Black, not pink
  },
  em: {
    fontStyle: 'italic' as const,
  },
  list_item: {
    marginBottom: Spacing.xs,
  },
  bullet_list: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  ordered_list: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  paragraph: {
    marginBottom: Spacing.sm,
  },
  link: {
    color: Colors.purple,
    textDecorationLine: 'underline' as const,
  },
};
