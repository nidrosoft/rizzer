/**
 * CreateRizzBottomSheet Component
 * Bottom sheet for creating custom Rizz categories
 * Allows user to set name, description, emoji, and color
 */

import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { CloseCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import GradientButton from '@/components/ui/GradientButton';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface CreateRizzBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: RizzCategoryData) => void;
  isCreating?: boolean;
}

export interface RizzCategoryData {
  name: string;
  description: string;
  emoji: string;
  color: string;
}

const PRESET_COLORS = [
  { color: '#FF6B9D', name: 'Pink' },
  { color: '#AB47BC', name: 'Purple' },
  { color: '#26C6DA', name: 'Cyan' },
  { color: '#66BB6A', name: 'Green' },
  { color: '#FFA726', name: 'Orange' },
  { color: '#FF5757', name: 'Red' },
  { color: '#5C6BC0', name: 'Indigo' },
  { color: '#EC407A', name: 'Hot Pink' },
  { color: '#42A5F5', name: 'Blue' },
  { color: '#7E57C2', name: 'Deep Purple' },
  { color: '#26A69A', name: 'Teal' },
  { color: '#9CCC65', name: 'Light Green' },
  { color: '#FFCA28', name: 'Amber' },
  { color: '#FF7043', name: 'Deep Orange' },
  { color: '#8D6E63', name: 'Brown' },
  { color: '#78909C', name: 'Blue Grey' },
];

const COMMON_EMOJIS = ['😊', '❤️', '🔥', '💪', '✨', '🎯', '💯', '🌟', '😎', '💖', '🎨', '🚀', '💋', '🌹', '💝', '🎭'];

export default function CreateRizzBottomSheet({ visible, onClose, onCreate, isCreating = false }: CreateRizzBottomSheetProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleCreate = () => {
    if (!name.trim()) {
      // TODO: Show error toast
      return;
    }

    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onCreate({
      name: name.trim(),
      description: description.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
    });

    // Reset form
    setName('');
    setDescription('');
    setSelectedEmoji('😊');
    setSelectedColor('#FF6B9D');
  };

  const handleEmojiSelect = (emoji: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedEmoji(emoji);
  };

  const handleColorSelect = (color: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedColor(color);
  };

  const isValid = name.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Custom Rizz</Text>
            <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
              <CloseCircle size={28} color={Colors.textSecondary} variant="Bold" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Category Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Category Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Smooth Compliments"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
                maxLength={30}
              />
              <Text style={styles.charCount}>{name.length}/30</Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your rizz category..."
                placeholderTextColor={Colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                maxLength={100}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{description.length}/100</Text>
            </View>

            {/* Emoji Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Choose Your Emoji</Text>
              <Text style={styles.helperText}>Type or pick an emoji</Text>
              <TextInput
                style={[styles.input, styles.emojiInput]}
                placeholder="😊"
                placeholderTextColor={Colors.textSecondary}
                value={selectedEmoji}
                onChangeText={setSelectedEmoji}
                maxLength={2}
              />
              <Text style={styles.helperText}>Or select from below:</Text>
              <View style={styles.emojiGrid}>
                {COMMON_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiButton,
                      selectedEmoji === emoji && styles.emojiButtonSelected,
                    ]}
                    onPress={() => handleEmojiSelect(emoji)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Choose Your Color</Text>
              <Text style={styles.helperText}>Select a color theme for your category</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map((item) => (
                  <TouchableOpacity
                    key={item.color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: `${item.color}15` },
                      selectedColor === item.color && styles.colorButtonSelected,
                    ]}
                    onPress={() => handleColorSelect(item.color)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.section}>
              <Text style={styles.label}>Preview</Text>
              <View style={[styles.previewCard, { backgroundColor: `${selectedColor}15`, borderColor: `${selectedColor}40` }]}>
                <View style={[styles.previewIcon, { backgroundColor: `${selectedColor}25` }]}>
                  <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
                </View>
                <View style={styles.previewContent}>
                  <Text style={styles.previewName}>{name || 'Category Name'}</Text>
                  <Text style={styles.previewDescription} numberOfLines={2}>
                    {description || 'Your description will appear here'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Create Button */}
          <View style={styles.footer}>
            <GradientButton
              title={isCreating ? "Creating..." : "Create Rizz Category"}
              onPress={handleCreate}
              disabled={!isValid || isCreating}
              fullWidth
            />
          </View>
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
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  helperText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  textArea: {
    minHeight: 80,
    paddingTop: Spacing.sm,
    textAlignVertical: 'top',
  },
  emojiInput: {
    fontSize: 40,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  charCount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: Colors.purple,
    backgroundColor: `${Colors.purple}15`,
  },
  emojiText: {
    fontSize: 32,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorButton: {
    width: 72,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: Colors.purple,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  previewCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: 28,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
  },
  previewName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  previewDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
