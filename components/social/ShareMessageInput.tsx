/**
 * Share Message Input Component
 * Optional custom message for sharing
 * MAX 100 lines - Micro component
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface ShareMessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
}

export default function ShareMessageInput({ 
  value, 
  onChangeText, 
  maxLength = 200 
}: ShareMessageInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add a message (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        multiline
        numberOfLines={3}
      />
      <Text style={styles.counter}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counter: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
});
