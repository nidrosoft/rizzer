/**
 * RSVP Modal Component
 * Confirmation modal after RSVP
 * MAX 140 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { TickCircle } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { RSVPStatus } from '@/types/events';

interface RSVPModalProps {
  visible: boolean;
  status: RSVPStatus;
  eventTitle: string;
  onClose: () => void;
  onAddToCalendar?: () => void;
}

export default function RSVPModal({ 
  visible, 
  status, 
  eventTitle, 
  onClose,
  onAddToCalendar 
}: RSVPModalProps) {
  const getMessage = () => {
    switch (status) {
      case 'going':
        return "You're going! 🎉";
      case 'interested':
        return "Marked as interested! ⭐";
      case 'not_going':
        return "Maybe next time! 👋";
      default:
        return "RSVP Updated";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TickCircle size={48} color={Colors.textWhite} variant="Bold" />
          </LinearGradient>
          
          <Text style={styles.title}>{getMessage()}</Text>
          <Text style={styles.subtitle}>{eventTitle}</Text>
          
          {status === 'going' && onAddToCalendar && (
            <TouchableOpacity style={styles.calendarButton} onPress={onAddToCalendar}>
              <Text style={styles.calendarText}>Add to Calendar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
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
    padding: Spacing.xl,
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  calendarButton: {
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  calendarText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  closeButton: {
    paddingVertical: Spacing.sm,
  },
  closeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textSecondary,
  },
});
