/**
 * ChatMessageList Component
 * Displays the scrollable list of chat messages
 */

import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ChatMessage from './ChatMessage';
import TypingIndicator from '@/components/ui/TypingIndicator';
import { Colors, Spacing, FontSizes } from '@/constants/theme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: Message[];
  loading: boolean;
  isTyping: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export default function ChatMessageList({
  messages,
  loading,
  isTyping,
  scrollViewRef,
}: ChatMessageListProps) {
  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.messagesContainer}
      contentContainerStyle={styles.messagesContent}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      {messages.length === 0 && !loading ? (
        <View style={styles.emptyChat}>
          <Text style={styles.emptyChatText}>Start a conversation with your dating coach!</Text>
        </View>
      ) : loading ? (
        <View style={styles.emptyChat}>
          <Text style={styles.emptyChatText}>Loading...</Text>
        </View>
      ) : (
        messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))
      )}
      {isTyping && <TypingIndicator />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyChatText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
