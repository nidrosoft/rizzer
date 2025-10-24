/**
 * Quick Notes Category Detail Screen
 * Folder-based organization with 2-column grid layout
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Edit2, Trash, SearchNormal, Note, More, Folder2, Add } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function NotesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderColor, setSelectedFolderColor] = useState('blue');

  const handleBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAdd = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowAddFolderModal(true);
  };

  const handleFolderPress = (folder: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to folder detail screen
    router.push(`/date-profile/categories/notes/folder?id=${id}&folderId=${folder.id}`);
  };

  const handleSaveFolder = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: Save folder to database
    setShowAddFolderModal(false);
    setNewFolderName('');
    setSelectedFolderColor('blue');
  };

  const handleMenu = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleDeleteCategory = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowCategoryDeleteModal(true), 300);
  };

  const handleArchive = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowArchiveModal(true), 300);
  };

  const confirmCategoryDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowCategoryDeleteModal(false);
    setTimeout(() => router.back(), 500);
  };

  const confirmArchive = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowArchiveModal(false);
    setTimeout(() => router.back(), 500);
  };

  const folderColors = {
    blue: { bg: '#E3F2FD', folder: '#2196F3' },
    yellow: { bg: '#FFF9E6', folder: '#FFC107' },
    green: { bg: '#E8F5E9', folder: '#4CAF50' },
    purple: { bg: '#F3E5F5', folder: '#9C27B0' },
    pink: { bg: 'rgba(255, 107, 157, 0.1)', folder: '#FF6B9D' },
    orange: { bg: '#FFF4E5', folder: '#FF9800' },
  };

  // Mock folders data with 4 notes each
  const folders = [
    { 
      id: '1', 
      name: 'Important', 
      color: 'pink', 
      noteCount: 4,
      notes: [
        'Allergic to shellfish',
        'Always check ingredients',
        'Emergency contact: 911',
        'Medication in bag'
      ]
    },
    { 
      id: '2', 
      name: 'Preferences', 
      color: 'yellow', 
      noteCount: 4,
      notes: [
        'Coffee: Oat milk latte',
        'Prefers window seats',
        'Loves Italian food',
        'No spicy food'
      ]
    },
    { 
      id: '3', 
      name: 'Interests', 
      color: 'blue', 
      noteCount: 4,
      notes: [
        'Loves photography',
        'Enjoys hiking trails',
        'Plays guitar',
        'Reads sci-fi novels'
      ]
    },
    { 
      id: '4', 
      name: 'Reminders', 
      color: 'green', 
      noteCount: 4,
      notes: [
        'Birthday: March 15',
        'Anniversary: June 20',
        'Dentist appointment',
        'Gym membership renewal'
      ]
    },
    { 
      id: '5', 
      name: 'Ideas', 
      color: 'orange', 
      noteCount: 4,
      notes: [
        'Weekend trip to beach',
        'Try new restaurant',
        'Movie night plans',
        'Surprise gift ideas'
      ]
    },
    { 
      id: '6', 
      name: 'Personal', 
      color: 'purple', 
      noteCount: 4,
      notes: [
        'Favorite color: Blue',
        'Morning person',
        'Loves surprises',
        'Prefers texting'
      ]
    },
  ];

  // Mock notes data for display
  const notes = [
    {
      id: '1',
      title: 'Allergies',
      content: 'Allergic to shellfish and peanuts. Always check menu before ordering.',
      category: 'Important',
      date: 'October 20, 2024',
      color: '#FFE5E5',
    },
    {
      id: '2',
      title: 'Coffee Order',
      content: 'Oat milk latte, extra shot, no sugar. Sometimes adds vanilla in winter.',
      category: 'Preferences',
      date: 'October 15, 2024',
      color: '#FFF9E5',
    },
    {
      id: '3',
      title: 'Favorite Songs',
      content: 'Loves "Levitating" by Dua Lipa, "Blinding Lights" by The Weeknd, anything by SZA.',
      category: 'Interests',
      date: 'October 10, 2024',
      color: '#E5F9FF',
    },
    {
      id: '4',
      title: 'Comfort Food',
      content: 'Mac and cheese when stressed. Chocolate ice cream for celebrations.',
      category: 'Food',
      date: 'October 5, 2024',
      color: '#F3E5FF',
    },
    {
      id: '5',
      title: 'Morning Routine',
      content: 'Wakes up at 7am, yoga 3x/week, always has breakfast. Not a morning person on Mondays.',
      category: 'Lifestyle',
      date: 'September 28, 2024',
      color: '#E5FFE5',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Important': '#FF6B9D',
      'Preferences': '#F59E0B',
      'Interests': '#2196F3',
      'Food': '#8B5CF6',
      'Lifestyle': '#10B981',
    };
    return colors[category] || Colors.purple;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.6}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
            <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Notes</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
          <More size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SearchNormal size={20} color={Colors.textSecondary} variant="Outline" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search folders..."
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Total Notes Count */}
        <View style={styles.totalCard}>
          <Note size={24} color={Colors.purple} variant="Bold" />
          <Text style={styles.totalText}>60 Quick Notes</Text>
        </View>

        {/* Folders Grid (2 columns) */}
        <View style={styles.foldersGrid}>
          {folders.map((folder) => {
            const colors = folderColors[folder.color as keyof typeof folderColors];
            return (
              <TouchableOpacity
                key={folder.id}
                style={[styles.folderCard, { backgroundColor: colors.bg }]}
                onPress={() => handleFolderPress(folder)}
                activeOpacity={0.7}
              >
                <View style={[styles.folderIcon, { backgroundColor: colors.folder }]}>
                  <Folder2 size={28} color={Colors.textWhite} variant="Bold" />
                </View>
                <Text style={styles.folderName}>{folder.name}</Text>
                <Text style={styles.folderCount}>{folder.noteCount} Notes</Text>
                
                {/* Preview of 4 notes */}
                <View style={styles.notesPreview}>
                  {folder.notes.map((note, index) => (
                    <View key={index} style={styles.notePreviewItem}>
                      <View style={styles.notePreviewDot} />
                      <Text style={styles.notePreviewText} numberOfLines={1}>{note}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* Add Folder Modal */}
      <Modal
        visible={showAddFolderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddFolderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Create New Folder</Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              {/* Folder Name */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Folder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Important, Ideas, Personal"
                  placeholderTextColor={Colors.textSecondary}
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                />
              </View>

              {/* Folder Color */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Folder Color</Text>
                <View style={styles.colorOptions}>
                  {Object.keys(folderColors).map((color) => {
                    const colors = folderColors[color as keyof typeof folderColors];
                    const isSelected = selectedFolderColor === color;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: colors.bg },
                          isSelected && styles.colorOptionSelected
                        ]}
                        onPress={() => {
                          if (Platform.OS === 'ios') {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                          setSelectedFolderColor(color);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.colorFolderIcon, { backgroundColor: colors.folder }]}>
                          <Folder2 size={24} color={Colors.textWhite} variant="Bold" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveFolder}
                activeOpacity={0.8}
                disabled={!newFolderName.trim()}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveButtonText}>Create Folder</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddFolderModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Action Sheet */}
      <CategoryActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onArchive={handleArchive}
        onDelete={handleDeleteCategory}
        title="Manage Notes"
        deleteModalVisible={showCategoryDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={confirmCategoryDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => setShowCategoryDeleteModal(false)}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage="This action cannot be undone. All quick notes will be permanently removed."
        archiveMessage="Notes will be moved to archives. You can restore them anytime."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: '#FAFAFA' },
  navButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.text },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
  totalCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  totalText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.text },
  foldersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  folderCard: { width: '48%', minHeight: 200, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, marginBottom: Spacing.sm },
  folderIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.xs },
  folderName: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: 2, textAlign: 'center' },
  folderCount: { fontSize: FontSizes.xs, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.sm },
  notesPreview: { width: '100%', gap: 4, marginTop: Spacing.xs },
  notePreviewItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notePreviewDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.textSecondary, opacity: 0.5 },
  notePreviewText: { flex: 1, fontSize: 11, color: Colors.text, opacity: 0.7 },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end' 
  },
  modal: { 
    backgroundColor: Colors.background, 
    borderTopLeftRadius: BorderRadius.xl, 
    borderTopRightRadius: BorderRadius.xl, 
    maxHeight: '85%' 
  },
  modalHandle: { 
    width: 40, 
    height: 4, 
    backgroundColor: Colors.borderLight, 
    borderRadius: 2, 
    alignSelf: 'center', 
    marginTop: Spacing.md, 
    marginBottom: Spacing.lg 
  },
  modalTitle: { 
    fontSize: FontSizes.xl, 
    fontWeight: FontWeights.bold, 
    color: Colors.text, 
    paddingHorizontal: Spacing.xl, 
    marginBottom: Spacing.lg 
  },
  modalScroll: { 
    maxHeight: 400 
  },
  modalContent: { 
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl 
  },
  inputSection: { 
    marginBottom: Spacing.xl 
  },
  inputLabel: { 
    fontSize: FontSizes.sm, 
    fontWeight: FontWeights.semibold, 
    color: Colors.text, 
    marginBottom: Spacing.sm 
  },
  input: { 
    backgroundColor: Colors.backgroundGray, 
    borderRadius: BorderRadius.md, 
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md, 
    fontSize: FontSizes.md, 
    color: Colors.text, 
    minHeight: 48 
  },
  colorOptions: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: Spacing.md 
  },
  colorOption: { 
    width: 64, 
    height: 64, 
    borderRadius: BorderRadius.md, 
    borderWidth: 2, 
    borderColor: Colors.borderLight, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  colorOptionSelected: { 
    borderWidth: 3, 
    borderColor: Colors.purple 
  },
  colorFolderIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalActions: { 
    paddingHorizontal: Spacing.xl, 
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight 
  },
  saveButton: { 
    borderRadius: BorderRadius.full, 
    overflow: 'hidden', 
    marginBottom: Spacing.sm 
  },
  saveButtonGradient: { 
    paddingVertical: Spacing.md + 2, 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  saveButtonText: { 
    fontSize: FontSizes.md, 
    fontWeight: FontWeights.bold, 
    color: Colors.textWhite 
  },
  cancelButton: { 
    paddingVertical: Spacing.md, 
    alignItems: 'center' 
  },
  cancelButtonText: { 
    fontSize: FontSizes.md, 
    fontWeight: FontWeights.semibold, 
    color: Colors.purple 
  },
});
