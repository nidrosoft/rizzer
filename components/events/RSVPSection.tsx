/**
 * RSVP Section Component
 * Container for RSVP buttons
 * MAX 90 lines - Micro component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { RSVPStatus } from '@/types/events';
import RSVPButton from './RSVPButton';

interface RSVPSectionProps {
  currentStatus: RSVPStatus;
  onStatusChange: (status: RSVPStatus) => void;
}

export default function RSVPSection({ currentStatus, onStatusChange }: RSVPSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Are you going?</Text>
      <View style={styles.buttonsRow}>
        <RSVPButton
          status="going"
          label="Going"
          icon="✅"
          isSelected={currentStatus === 'going'}
          onPress={() => onStatusChange('going')}
        />
        <RSVPButton
          status="interested"
          label="Interested"
          icon="⭐"
          isSelected={currentStatus === 'interested'}
          onPress={() => onStatusChange('interested')}
        />
        <RSVPButton
          status="not_going"
          label="Can't Go"
          icon="❌"
          isSelected={currentStatus === 'not_going'}
          onPress={() => onStatusChange('not_going')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
