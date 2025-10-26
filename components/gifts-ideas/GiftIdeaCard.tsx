/**
 * Gift Idea Card Component
 * Displays a single gift idea with delete functionality
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Trash } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftIdea } from '@/types/dateProfileGifts';

interface GiftIdeaCardProps {
  idea: GiftIdea;
  onDelete: (id: string, title: string) => void;
}

export default function GiftIdeaCard({ idea, onDelete }: GiftIdeaCardProps) {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'High': '#FF6B9D',
      'Medium': '#F59E0B',
      'Low': '#10B981',
    };
    return colors[priority] || Colors.purple;
  };

  const handleDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onDelete(idea.id, idea.title);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{idea.title}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(idea.priority)}15` }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(idea.priority) }]}>
            {idea.priority}
          </Text>
        </View>
      </View>

      {idea.occasion && (
        <View style={styles.row}>
          <Text style={styles.label}>Occasion:</Text>
          <Text style={styles.value}>{idea.occasion}</Text>
        </View>
      )}

      {idea.budget && (
        <View style={styles.row}>
          <Text style={styles.label}>Budget:</Text>
          <Text style={styles.value}>{idea.budget}</Text>
        </View>
      )}

      {idea.notes && <Text style={styles.notes}>{idea.notes}</Text>}

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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
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
    flex: 1,
  },
  notes: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
