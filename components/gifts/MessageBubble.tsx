/**
 * MessageBubble Component
 * Displays individual chat messages with sender-specific styling
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { MessageBubbleProps } from '@/types/gifts';

export default function MessageBubble({ message, recipientName }: MessageBubbleProps) {
  const isSherlock = message.sender === 'sherlock';
  const isRecipient = message.sender === 'recipient';
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderAvatar = () => {
    if (isSherlock) {
      return (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[GiftsConfig.gradient.start, GiftsConfig.gradient.end]}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>S</Text>
          </LinearGradient>
        </View>
      );
    }

    if (isRecipient) {
      return (
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, styles.recipientAvatar]}>
            <Text style={[styles.avatarText, styles.recipientAvatarText]}>
              {recipientName?.charAt(0) || 'R'}
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const renderBubble = () => {
    if (isSherlock) {
      return (
        <View style={[styles.bubble, styles.sherlockBubble]}>
          <Text style={[styles.messageText, styles.sherlockText]}>
            {message.content}
          </Text>
        </View>
      );
    }

    if (isUser) {
      return (
        <View style={styles.userMessageContainer}>
          <View style={styles.userLabel}>
            <Text style={styles.userLabelText}>✏️ You</Text>
          </View>
          <View style={[styles.bubble, styles.userBubble]}>
            <Text style={[styles.messageText, styles.userText]}>
              {message.content}
            </Text>
          </View>
        </View>
      );
    }

    // Recipient
    return (
      <View style={[styles.bubble, styles.recipientBubble]}>
        <Text style={[styles.messageText, styles.recipientText]}>
          {message.content}
        </Text>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isSherlock && styles.sherlockContainer,
      isRecipient && styles.recipientContainer,
      isUser && styles.userContainer,
    ]}>
      {/* Avatar (left side for Sherlock) */}
      {isSherlock && renderAvatar()}

      {/* Message Content */}
      <View style={styles.messageContainer}>
        {renderBubble()}
        <Text style={[
          styles.timestamp,
          isSherlock && styles.timestampLeft,
          (isRecipient || isUser) && styles.timestampRight,
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {/* Avatar (right side for Recipient) */}
      {isRecipient && renderAvatar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sherlockContainer: {
    justifyContent: 'flex-start',
  },
  recipientContainer: {
    justifyContent: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: Spacing.sm,
    marginTop: Spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipientAvatar: {
    backgroundColor: Colors.backgroundGray,
  },
  avatarText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  recipientAvatarText: {
    color: Colors.text,
  },
  messageContainer: {
    maxWidth: '75%',
  },
  bubble: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  sherlockBubble: {
    backgroundColor: `${GiftsConfig.gradient.start}15`,
    borderBottomLeftRadius: 4,
  },
  recipientBubble: {
    backgroundColor: Colors.backgroundGray,
    borderBottomRightRadius: 4,
  },
  userBubble: {
    backgroundColor: `${Colors.purple}15`,
    borderBottomLeftRadius: 4,
  },
  userMessageContainer: {
    width: '100%',
  },
  userLabel: {
    marginBottom: Spacing.xs - 2,
    marginLeft: Spacing.xs,
  },
  userLabelText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  sherlockText: {
    color: Colors.text,
  },
  recipientText: {
    color: Colors.text,
  },
  userText: {
    color: Colors.text,
  },
  timestamp: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs - 2,
  },
  timestampLeft: {
    textAlign: 'left',
    marginLeft: Spacing.xs,
  },
  timestampRight: {
    textAlign: 'right',
    marginRight: Spacing.xs,
  },
});
