/**
 * Permission Modal Component
 * Custom styled modal for requesting permissions (microphone, camera, location)
 * Uses the same style as delete confirmation modals throughout the app
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onAllow: () => void;
  title: string;
  message: string;
  icon: React.ReactNode;
  iconColor?: string;
}

export default function PermissionModal({
  visible,
  onClose,
  onAllow,
  title,
  message,
  icon,
  iconColor = Colors.purple,
}: PermissionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={[styles.modalIcon, { backgroundColor: `${iconColor}15` }]}>
            {icon}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          
          <TouchableOpacity 
            style={styles.allowButton}
            onPress={onAllow}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.allowButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.allowButtonText}>Allow</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    position: 'relative',
  },
  modalIcon: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'left',
    lineHeight: 28,
    width: '100%',
  },
  modalMessage: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'left',
    marginBottom: Spacing.xl,
    lineHeight: 22,
    width: '100%',
  },
  allowButton: {
    width: '100%',
    marginBottom: Spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  allowButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  allowButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
