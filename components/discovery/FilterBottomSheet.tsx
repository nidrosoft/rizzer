/**
 * Filter Bottom Sheet Component
 * Allows users to filter discovery content by various criteria
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface FilterOption {
  id: string;
  label: string;
  category: string;
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedFilters: string[]) => void;
}

const FILTER_OPTIONS: FilterOption[] = [
  // Price Range
  { id: 'free', label: 'Free', category: 'Price' },
  { id: 'budget', label: 'Budget Friendly ($)', category: 'Price' },
  { id: 'moderate', label: 'Moderate ($$)', category: 'Price' },
  { id: 'premium', label: 'Premium ($$$)', category: 'Price' },
  
  // Time of Day
  { id: 'morning', label: 'Morning', category: 'Time' },
  { id: 'afternoon', label: 'Afternoon', category: 'Time' },
  { id: 'evening', label: 'Evening', category: 'Time' },
  { id: 'night', label: 'Night', category: 'Time' },
  
  // Activity Type
  { id: 'indoor', label: 'Indoor', category: 'Type' },
  { id: 'outdoor', label: 'Outdoor', category: 'Type' },
  { id: 'active', label: 'Active', category: 'Type' },
  { id: 'relaxing', label: 'Relaxing', category: 'Type' },
  { id: 'romantic', label: 'Romantic', category: 'Type' },
  { id: 'adventurous', label: 'Adventurous', category: 'Type' },
  
  // Distance
  { id: 'nearby', label: 'Nearby (< 5 mi)', category: 'Distance' },
  { id: 'moderate_distance', label: 'Moderate (5-15 mi)', category: 'Distance' },
  { id: 'far', label: 'Far (> 15 mi)', category: 'Distance' },
];

export default function FilterBottomSheet({ visible, onClose, onApply }: FilterBottomSheetProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleClose = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleFilterToggle = (filterId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleClearAll = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedFilters([]);
  };

  const handleApply = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onApply(selectedFilters);
    onClose();
  };

  const categories = ['Price', 'Time', 'Type', 'Distance'];

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.bottomSheet}>
          {/* Handle Bar */}
          <View style={styles.handle} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {categories.map(category => {
              const options = FILTER_OPTIONS.filter(opt => opt.category === category);
              
              return (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.optionsGrid}>
                    {options.map(option => {
                      const isSelected = selectedFilters.includes(option.id);
                      
                      return (
                        <TouchableOpacity
                          key={option.id}
                          style={[styles.filterOption, isSelected && styles.filterOptionSelected]}
                          onPress={() => handleFilterToggle(option.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.filterLabel, isSelected && styles.filterLabelSelected]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
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
                <Text style={styles.applyText}>
                  Apply Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxl + Spacing.lg : Spacing.xxl,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  clearText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  content: {
    maxHeight: 400,
    paddingHorizontal: Spacing.xl,
  },
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionSelected: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  filterLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  filterLabelSelected: {
    color: Colors.textWhite,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  applyButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
