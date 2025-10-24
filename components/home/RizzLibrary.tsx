/**
 * RizzLibrary Component
 * Horizontal scrollable rizz categories with quick add
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Modal } from 'react-native';
import { MessageText, Heart, Lamp, Add, TickCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { MyRizzSectionProps } from '@/types/home';
import { useToast } from '@/contexts/ToastContext';

// Rizz category icons
const getRizzIcon = (title: string) => {
  if (title.toLowerCase().includes('friendly') || title.toLowerCase().includes('opener')) {
    return { IconComponent: MessageText, color: '#26C6DA', bg: 'rgba(38, 198, 218, 0.15)' };
  } else if (title.toLowerCase().includes('flirty') || title.toLowerCase().includes('line')) {
    return { IconComponent: Heart, color: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.15)' };
  } else if (title.toLowerCase().includes('funny') || title.toLowerCase().includes('joke')) {
    return { IconComponent: Lamp, color: '#FFA726', bg: 'rgba(255, 167, 38, 0.15)' };
  }
  return { IconComponent: MessageText, color: '#AB47BC', bg: 'rgba(171, 71, 188, 0.15)' };
};

// All available Rizz categories
const allRizzCategories = [
  { id: 1, title: 'Friendly Opener', icon: MessageText, color: '#26C6DA', bg: 'rgba(38, 198, 218, 0.15)' },
  { id: 2, title: 'Flirty Line', icon: Heart, color: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.15)' },
  { id: 3, title: 'Funny Joke', icon: Lamp, color: '#FFA726', bg: 'rgba(255, 167, 38, 0.15)' },
  { id: 4, title: 'Smooth Compliment', icon: Heart, color: '#AB47BC', bg: 'rgba(171, 71, 188, 0.15)' },
  { id: 5, title: 'Witty Banter', icon: MessageText, color: '#66BB6A', bg: 'rgba(102, 187, 106, 0.15)' },
  { id: 6, title: 'Bold Move', icon: Lamp, color: '#FF5757', bg: 'rgba(255, 87, 87, 0.15)' },
];

export default function RizzLibrary({
  rizzItems,
  onRizzPress,
  onAddRizz,
  onSeeAll,
}: MyRizzSectionProps) {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleRizzPress = (rizz: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRizzPress?.(rizz);
  };

  const handleAddRizz = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowModal(true);
  };

  const handleSeeAll = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSeeAll?.();
  };

  const toggleCategory = (id: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const count = selectedCategories.length;
    setShowModal(false);
    setSelectedCategories([]);
    
    // Show success toast
    showToast(`${count} ${count === 1 ? 'category' : 'categories'} added to your Rizz`, 'success');
    
    // Here you would actually add the selected categories to the home screen
    console.log('Selected categories:', selectedCategories);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Rizz</Text>
        <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {rizzItems.map((rizz) => {
          const iconStyle = getRizzIcon(rizz.title);
          const RizzIcon = iconStyle.IconComponent;
          return (
            <TouchableOpacity
              key={rizz.id}
              style={styles.rizzCard}
              activeOpacity={0.8}
              onPress={() => handleRizzPress(rizz)}
            >
              <View style={[styles.rizzIcon, { backgroundColor: iconStyle.bg }]}>
                <RizzIcon size={20} color={iconStyle.color} variant="Bold" />
              </View>
              <Text style={styles.rizzTitle}>Pickup Lines</Text>
              <Text style={styles.rizzCount}>12 lines</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.addRizzCard} onPress={handleAddRizz} activeOpacity={0.8}>
          <Add size={24} color={Colors.purple} variant="Bold" />
          <Text style={styles.addText}>Add New</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Rizz Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Pickup Lines</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Select categories to add to your home screen</Text>
            
            <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
              {allRizzCategories.map((category) => {
                const CategoryIcon = category.icon;
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                    onPress={() => toggleCategory(category.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: category.bg }]}>
                      <CategoryIcon size={20} color={category.color} variant="Bold" />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryCount}>12 lines</Text>
                    </View>
                    {isSelected && (
                      <TickCircle size={24} color={Colors.purple} variant="Bold" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.doneButton, selectedCategories.length === 0 && styles.doneButtonDisabled]} 
              onPress={handleDone}
              disabled={selectedCategories.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>
                Add {selectedCategories.length > 0 ? `${selectedCategories.length} ` : ''}Categories
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    color: Colors.purple,
    fontWeight: FontWeights.semibold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  rizzCard: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  rizzIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  rizzTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  rizzCount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  addRizzCard: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.purple,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background,
  },
  addText: {
    fontSize: FontSizes.sm,
    color: Colors.purple,
    fontWeight: FontWeights.bold,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  modalClose: {
    fontSize: 28,
    color: Colors.textSecondary,
    fontWeight: FontWeights.bold,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  categoriesList: {
    maxHeight: 400,
    marginBottom: Spacing.lg,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  categoryItemSelected: {
    borderColor: Colors.purple,
    borderWidth: 2,
    backgroundColor: 'rgba(171, 71, 188, 0.05)',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  doneButton: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.full,
    padding: Spacing.md,
    alignItems: 'center',
  },
  doneButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  doneButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
});
