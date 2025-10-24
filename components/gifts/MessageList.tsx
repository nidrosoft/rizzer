/**
 * MessageList Component
 * Scrollable list of chat messages with reverse chronological order
 */

import React, { useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Animated } from 'react-native';
import { Spacing } from '@/constants/theme';
import { MessageListProps } from '@/types/gifts';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, recipientName }: MessageListProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            recipientName={recipientName}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});
