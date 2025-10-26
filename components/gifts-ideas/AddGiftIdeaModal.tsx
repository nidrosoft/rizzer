/**
 * Add Gift Idea Modal Component
 * Form for creating new gift ideas
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { GiftIdeaPriority } from '@/types/dateProfileGifts';

interface AddGiftIdeaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    occasion: string;
    budget: string;
    notes: string;
    priority: GiftIdeaPriority;
  }) => Promise<void>;
  isSaving: boolean;
}

export default function AddGiftIdeaModal({ visible, onClose, onSave, isSaving }: AddGiftIdeaModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    occasion: '',
    budget: '',
    notes: '',
    priority: 'Medium' as GiftIdeaPriority,
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'High': '#FF6B9D',
      'Medium': '#F59E0B',
      'Low': '#10B981',
    };
    return colors[priority] || Colors.purple;
  };

  const handleSave = async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await onSave(formData);
    // Reset form after successful save
    setFormData({
      title: '',
      occasion: '',
      budget: '',
      notes: '',
      priority: 'Medium',
    });
  };

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add Gift Idea</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Gift Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="What's the gift?"
                placeholderTextColor={Colors.textSecondary}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Occasion</Text>
              <TextInput
                style={styles.input}
                placeholder="Birthday, Anniversary, etc."
                placeholderTextColor={Colors.textSecondary}
                value={formData.occasion}
                onChangeText={(text) => setFormData({ ...formData, occasion: text })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Budget</Text>
              <TextInput
                style={styles.input}
                placeholder="$50-100"
                placeholderTextColor={Colors.textSecondary}
                value={formData.budget}
                onChangeText={(text) => setFormData({ ...formData, budget: text })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityOptions}>
                {(['High', 'Medium', 'Low'] as GiftIdeaPriority[]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      { backgroundColor: `${getPriorityColor(priority)}15` },
                      formData.priority === priority && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, priority })}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.priorityOptionText, { color: getPriorityColor(priority) }]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Why this gift? Any special notes..."
                placeholderTextColor={Colors.textSecondary}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isSaving ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={styles.saveButtonText}>Save Idea</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isSaving}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 48,
  },
  inputMultiline: {
    minHeight: 100,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  priorityOptionSelected: {
    borderWidth: 2,
    borderColor: Colors.purple,
  },
  priorityOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  saveButton: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  saveButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
});
