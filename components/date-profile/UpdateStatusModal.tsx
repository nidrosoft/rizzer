/**
 * UpdateStatusModal Component
 * Bottom sheet for updating relationship status
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Heart, CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface UpdateStatusModalProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: string;
  onStatusUpdate: (status: string) => void;
}

const RELATIONSHIP_STATUSES = [
  { value: 'Just Met', label: 'Just Met', emoji: '👋', color: '#FFB6C1' },
  { value: 'Talking', label: 'Talking', emoji: '💬', color: '#DDA0DD' },
  { value: 'Dating', label: 'Dating', emoji: '💕', color: '#FF69B4' },
  { value: 'Serious', label: 'Serious', emoji: '❤️', color: '#FF1493' },
  { value: 'Engaged', label: 'Engaged', emoji: '💍', color: '#FF6347' },
  { value: 'Married', label: 'Married', emoji: '👰', color: '#FFD700' },
];

export default function UpdateStatusModal({
  visible,
  onClose,
  currentStatus,
  onStatusUpdate,
}: UpdateStatusModalProps) {
  const handleStatusSelect = (status: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onStatusUpdate(status);
    onClose();
  };

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <View style={styles.bottomSheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Heart size={24} color={Colors.purple} variant="Bold" />
              <Text style={styles.title}>Update Status</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <CloseCircle size={28} color={Colors.textSecondary} variant="Bold" />
            </TouchableOpacity>
          </View>

          {/* Status Options */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {RELATIONSHIP_STATUSES.map((status) => {
              const isSelected = currentStatus === status.value || 
                               currentStatus.toLowerCase() === status.value.toLowerCase();
              
              return (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.statusOption,
                    isSelected && styles.statusOptionSelected
                  ]}
                  onPress={() => handleStatusSelect(status.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.statusLeft}>
                    <View style={[styles.emojiContainer, { backgroundColor: `${status.color}20` }]}>
                      <Text style={styles.emoji}>{status.emoji}</Text>
                    </View>
                    <View style={styles.statusInfo}>
                      <Text style={[
                        styles.statusLabel,
                        isSelected && styles.statusLabelSelected
                      ]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                  
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <LinearGradient
                        colors={[Colors.gradientStart, Colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.checkmarkGradient}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </LinearGradient>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '80%',
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  statusOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusOptionSelected: {
    backgroundColor: `${Colors.purple}10`,
    borderColor: Colors.purple,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  statusInfo: {
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  statusLabelSelected: {
    color: Colors.purple,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  checkmarkGradient: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
