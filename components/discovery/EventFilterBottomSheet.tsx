/**
 * Event Filter Bottom Sheet Component
 * Allows users to filter events by various criteria
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

interface EventFilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedFilters: string[]) => void;
}

const FILTER_OPTIONS: FilterOption[] = [
  // Price Range
  { id: 'free', label: 'Free', category: 'Price' },
  { id: 'under25', label: 'Under $25', category: 'Price' },
  { id: '25to50', label: '$25 - $50', category: 'Price' },
  { id: 'over50', label: 'Over $50', category: 'Price' },
  
  // Date
  { id: 'today', label: 'Today', category: 'Date' },
  { id: 'tomorrow', label: 'Tomorrow', category: 'Date' },
  { id: 'this_week', label: 'This Week', category: 'Date' },
  { id: 'this_weekend', label: 'This Weekend', category: 'Date' },
  { id: 'next_week', label: 'Next Week', category: 'Date' },
  
  // Event Type
  { id: 'date_friendly', label: 'Date Friendly', category: 'Type' },
  { id: 'singles_welcome', label: 'Singles Welcome', category: 'Type' },
  { id: 'indoor', label: 'Indoor', category: 'Type' },
  { id: 'outdoor', label: 'Outdoor', category: 'Type' },
  
  // Distance
  { id: 'nearby', label: 'Nearby (< 3 mi)', category: 'Distance' },
  { id: 'moderate', label: 'Moderate (3-10 mi)', category: 'Distance' },
  { id: 'far', label: 'Far (> 10 mi)', category: 'Distance' },
];

export default function EventFilterBottomSheet({ visible, onClose, onApply }: EventFilterBottomSheetProps) {
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

  const categories = ['Price', 'Date', 'Type', 'Distance'];

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
            <Text style={styles.title}>Event Filters</Text>
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
