/**
 * Category Manage Sheet Component
 * Bottom sheet with Delete/Archive options for long-press on category
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Trash, Archive } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface CategoryManageSheetProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  categoryTitle?: string;
  onDeletePress?: () => void; // Triggers delete confirmation modal
}

export default function CategoryManageSheet({
  visible,
  onClose,
  onDelete,
  onArchive,
  categoryTitle,
  onDeletePress,
}: CategoryManageSheetProps) {
  const handleDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // If onDeletePress is provided, use it (shows confirmation modal)
    // Otherwise use onDelete directly
    if (onDeletePress) {
      onDeletePress();
    } else {
      onDelete();
    }
  };

  const handleArchive = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onArchive();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>
            {categoryTitle ? `Manage "${categoryTitle}"` : 'Manage Category'}
          </Text>
          
          <TouchableOpacity 
            style={styles.option}
            onPress={handleArchive}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${Colors.purple}15` }]}>
              <Archive size={22} color={Colors.purple} variant="Bold" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Archive Category</Text>
              <Text style={styles.optionSubtext}>Hide from view, keep data</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.option}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FFE5E5' }]}>
              <Trash size={22} color="#FF4444" variant="Bold" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.optionText, { color: '#FF4444' }]}>Delete Category</Text>
              <Text style={styles.optionSubtext}>Remove permanently</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xxl,
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
    fontSize: normalize(18),
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: normalize(16),
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: normalize(14),
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.xl,
  },
});
