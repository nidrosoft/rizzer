/**
 * Alert Modal Component
 * Reusable modal for errors, confirmations, and alerts
 * Based on the DeleteModal design from Rizz category detail
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  primaryButtonColor?: string;
}

export default function AlertModal({
  visible,
  onClose,
  icon,
  title,
  message,
  primaryButtonText = 'Got it!',
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  primaryButtonColor,
}: AlertModalProps) {
  const handlePrimaryPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      onClose();
    }
  };

  const handleSecondaryPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onSecondaryPress) {
      onSecondaryPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Icon in top-right corner */}
          <View style={styles.icon}>
            {icon}
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Primary Button */}
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handlePrimaryPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={primaryButtonColor ? [primaryButtonColor, primaryButtonColor] : [Colors.gradientStart, Colors.gradientEnd]}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryText}>{primaryButtonText}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Button (optional) */}
          {secondaryButtonText && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleSecondaryPress}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryText}>{secondaryButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    maxWidth: 340,
    width: '85%',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    lineHeight: 28,
  },
  message: {
    fontSize: normalize(16),
    color: Colors.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  primaryGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
