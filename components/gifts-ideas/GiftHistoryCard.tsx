/**
 * Gift History Card Component
 * Displays a single gift history entry with delete functionality
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Gift, Heart, Trash } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftHistory } from '@/types/dateProfileGifts';

interface GiftHistoryCardProps {
  gift: GiftHistory;
  onDelete: (id: string, title: string) => void;
}

export default function GiftHistoryCard({ gift, onDelete }: GiftHistoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDelete(gift.id, gift.title);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Gift size={24} color={Colors.purple} variant="Bold" />
        <View style={styles.headerText}>
          <Text style={styles.title}>{gift.title}</Text>
          <Text style={styles.date}>{formatDate(gift.date_given)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        {gift.occasion && (
          <View style={styles.row}>
            <Text style={styles.label}>Occasion:</Text>
            <Text style={styles.value}>{gift.occasion}</Text>
          </View>
        )}
        {gift.price && (
          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>{gift.price}</Text>
          </View>
        )}
      </View>

      {gift.reaction && (
        <View style={styles.reactionContainer}>
          <Heart size={16} color="#FF6B9D" variant="Bold" />
          <Text style={styles.reactionText}>
            {gift.reaction_emoji} {gift.reaction}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
        <Trash size={18} color="#FF6B9D" variant="Outline" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  date: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  details: {
    gap: 4,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    width: 80,
  },
  value: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  reactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reactionText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  deleteButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: '#FF6B9D',
  },
});
