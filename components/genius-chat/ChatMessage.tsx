/**
 * ChatMessage Component
 * Displays a single chat message (user or AI)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  return (
    <View
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {message.isUser ? (
        <Text style={styles.userMessageText}>{message.text}</Text>
      ) : (
        <Markdown style={markdownStyles}>{message.text}</Markdown>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.gradientStart,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundGray,
  },
  userMessageText: {
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    lineHeight: 22,
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
