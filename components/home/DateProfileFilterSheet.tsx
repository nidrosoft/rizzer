/**
 * DateProfileFilterSheet Component
 * Bottom sheet for filtering and sorting date profiles
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { CloseSquare, TickCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: 'all' | 'talking' | 'dating' | 'exclusive' | 'engaged';
  currentSort: 'newest' | 'oldest' | 'name_asc' | 'name_desc';
  onApply: (status: 'all' | 'talking' | 'dating' | 'exclusive' | 'engaged', sort: 'newest' | 'oldest' | 'name_asc' | 'name_desc') => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Profiles', emoji: '💫' },
  { value: 'talking', label: 'Talking', emoji: '💬' },
  { value: 'dating', label: 'Dating', emoji: '💕' },
  { value: 'exclusive', label: 'Exclusive', emoji: '💖' },
  { value: 'engaged', label: 'Engaged', emoji: '💍' },
] as const;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: '📅' },
  { value: 'oldest', label: 'Oldest First', icon: '🗓️' },
  { value: 'name_asc', label: 'Name (A-Z)', icon: '🔤' },
  { value: 'name_desc', label: 'Name (Z-A)', icon: '🔡' },
] as const;

export default function DateProfileFilterSheet({
  visible,
  onClose,
  currentStatus,
  currentSort,
  onApply,
}: FilterSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const handleApply = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApply(selectedStatus, selectedSort);
    onClose();
  };

  const handleClear = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedStatus('all');
    setSelectedSort('newest');
  };

  const handleStatusSelect = (status: typeof selectedStatus) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedStatus(status);
  };

  const handleSortSelect = (sort: typeof selectedSort) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedSort(sort);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <SafeAreaView style={styles.sheetContainer} edges={['bottom']}>
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Filter & Sort</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <CloseSquare size={24} color={Colors.text} variant="Outline" />
              </TouchableOpacity>
            </View>

            {/* Status Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Relationship Status</Text>
              <View style={styles.optionsGrid}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      selectedStatus === option.value && styles.optionSelected,
                    ]}
                    onPress={() => handleStatusSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        selectedStatus === option.value && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedStatus === option.value && (
                      <View style={styles.checkmark}>
                        <TickCircle size={18} color={Colors.purple} variant="Bold" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsList}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      selectedSort === option.value && styles.sortOptionSelected,
                    ]}
                    onPress={() => handleSortSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sortIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.sortLabel,
                        selectedSort === option.value && styles.sortLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedSort === option.value && (
                      <TickCircle size={20} color={Colors.purple} variant="Bold" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.applyGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
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
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  sheet: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  optionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: Colors.purple,
    fontWeight: FontWeights.bold,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sortOptionSelected: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
  sortIcon: {
    fontSize: 20,
  },
  sortLabel: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  sortLabelSelected: {
    color: Colors.purple,
    fontWeight: FontWeights.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  applyButton: {
    flex: 2,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
