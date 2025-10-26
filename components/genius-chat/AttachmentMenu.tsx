/**
 * AttachmentMenu Component
 * Bottom sheet modal for selecting camera or gallery
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Camera, Gallery } from 'iconsax-react-native';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';

interface AttachmentMenuProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

export default function AttachmentMenu({ visible, onClose, onCamera, onGallery }: AttachmentMenuProps) {
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
          <Text style={styles.title}>Add Attachment</Text>
          
          <TouchableOpacity 
            style={styles.option}
            onPress={onCamera}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${Colors.purple}15` }]}>
              <Camera size={22} color={Colors.purple} variant="Bold" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Camera</Text>
              <Text style={styles.optionSubtext}>Take a photo</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.option}
            onPress={onGallery}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${Colors.purple}15` }]}>
              <Gallery size={22} color={Colors.purple} variant="Bold" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionText}>Gallery</Text>
              <Text style={styles.optionSubtext}>Choose from library</Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    fontSize: FontSizes.lg,
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
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.xl,
  },
});
