/**
 * ChatInput Component
 * Input area with text field, send button, microphone, and attachment buttons
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Microphone, AttachCircle, Send2 } from 'iconsax-react-native';
import AudioWaveform from '@/components/ui/AudioWaveform';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface ChatInputProps {
  message: string;
  onChangeMessage: (text: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
  onAttachment: () => void;
  recording: boolean;
  sending: boolean;
  selectedImage: string | null;
  onRemoveImage: () => void;
  analyzingImage: boolean;
}

export default function ChatInput({
  message,
  onChangeMessage,
  onSend,
  onVoiceInput,
  onAttachment,
  recording,
  sending,
  selectedImage,
  onRemoveImage,
  analyzingImage,
}: ChatInputProps) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TouchableOpacity 
          style={styles.inputIconButton}
          onPress={onAttachment}
          activeOpacity={0.6}
        >
          <AttachCircle size={24} color={Colors.textSecondary} variant="Bold" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Ask anything..."
          placeholderTextColor={Colors.textSecondary}
          value={message}
          onChangeText={onChangeMessage}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          style={styles.inputIconButton}
          onPress={onVoiceInput}
          activeOpacity={0.6}
        >
          {recording ? (
            <AudioWaveform isRecording={recording} color={Colors.textSecondary} />
          ) : (
            <Microphone size={24} color={Colors.textSecondary} variant="Bold" />
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.sendButton}
        onPress={onSend}
        disabled={!message.trim() || sending}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={message.trim() && !sending ? [Colors.gradientStart, Colors.gradientEnd] : ['#E0E0E0', '#E0E0E0']}
          style={styles.sendButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Send2 size={20} color={Colors.textWhite} variant="Bold" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          {!analyzingImage && (
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={onRemoveImage}
              activeOpacity={0.6}
            >
              <Send2 size={16} color={Colors.textWhite} variant="Bold" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  inputIconButton: {
    padding: Spacing.xs,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    maxHeight: 100,
    paddingVertical: Spacing.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    position: 'absolute',
    bottom: 70,
    left: Spacing.lg,
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundGray,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
