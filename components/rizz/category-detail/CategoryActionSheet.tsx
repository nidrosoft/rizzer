/**
 * Category Action Sheet Component
 * Bottom sheet with category options (Add to Home, Delete)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Home2, Trash } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { normalize } from '@/utils/responsive';

interface CategoryActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddToHome: () => void;
  onDelete: () => void;
}

export default function CategoryActionSheet({
  visible,
  onClose,
  onAddToHome,
  onDelete,
}: CategoryActionSheetProps) {
  const handleAddToHome = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onAddToHome();
  };

  const handleDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onDelete();
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
          <Text style={styles.title}>Category Options</Text>
          
          <TouchableOpacity 
            style={styles.option}
            onPress={handleAddToHome}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Home2 size={22} color={Colors.purple} variant="Bold" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Add to Home</Text>
              <Text style={styles.optionSubtext}>Pin to Quick Actions</Text>
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
    backgroundColor: `${Colors.purple}15`,
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
