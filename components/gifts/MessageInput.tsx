/**
 * MessageInput Component
 * Input field for injecting messages into the conversation
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Send2, InfoCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftsConfig } from '@/constants/gifts';
import { MessageInputProps } from '@/types/gifts';

interface ExtendedMessageInputProps extends MessageInputProps {
  isPaused?: boolean;
}

export default function MessageInput({ onSend, placeholder = 'Inject message...', isPaused = false }: ExtendedMessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim().length === 0) return;

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onSend(message.trim());
    setMessage('');
  };

  const isValid = message.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {isPaused && (
          <View style={styles.pausedBanner}>
            <InfoCircle size={16} color={Colors.warning} variant="Bold" />
            <Text style={styles.pausedText}>Investigation paused - Resume to inject messages</Text>
          </View>
        )}
        <View style={[styles.inputContainer, isPaused && styles.inputContainerDisabled]}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={isPaused ? 'Resume investigation to inject messages' : placeholder}
            placeholderTextColor={Colors.textSecondary}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            editable={!isPaused}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!isValid || isPaused) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!isValid || isPaused}
            activeOpacity={0.7}
          >
            <Send2
              size={20}
              color={isValid && !isPaused ? GiftsConfig.gradient.start : Colors.textSecondary}
              variant="Bold"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  pausedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.warning}15`,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  pausedText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.warning,
    fontWeight: FontWeights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputContainerDisabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${GiftsConfig.gradient.start}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.backgroundGray,
  },
});
