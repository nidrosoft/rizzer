/**
 * Dates & Events Category Detail Screen
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Calendar, More, Edit2, Trash } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

export default function DatesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDateDeleteModal, setShowDateDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);

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
    setSelectedDate(null);
    setShowAddModal(true);
  };

  const handleEditDate = (date: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedDate(date);
    setShowAddModal(true);
  };

  const handleDeleteDate = (date: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedDate(date);
    setShowDateDeleteModal(true);
  };

  const confirmDateDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDateDeleteModal(false);
    setSelectedDate(null);
  };

  const handleSaveDate = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowAddModal(false);
    setSelectedDate(null);
  };

  const handleMenu = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowActionSheet(true);
  };

  const handleDelete = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowDeleteModal(true), 300);
  };

  const handleArchive = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowArchiveModal(true), 300);
  };

  const confirmDelete = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowDeleteModal(false);
    setTimeout(() => router.back(), 500);
  };

  const confirmArchive = () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowArchiveModal(false);
    setTimeout(() => router.back(), 500);
  };

  const dates = [
    { id: '1', title: 'Coffee at Central Perk', date: 'Oct 18, 2024', location: 'Central Park', type: 'past' },
    { id: '2', title: 'Dinner at Italian Restaurant', date: 'Oct 12, 2024', location: 'Downtown', type: 'past' },
    { id: '3', title: 'Movie Night', date: 'Oct 25, 2024', location: 'Cinema', type: 'upcoming' },
  ];

  const pastDates = dates.filter(d => d.type === 'past');
  const upcomingDates = dates.filter(d => d.type === 'upcoming');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.6}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.13 19.0596H7.13C6.72 19.0596 6.38 18.7196 6.38 18.3096C6.38 17.8996 6.72 17.5596 7.13 17.5596H15.13C17.47 17.5596 19.38 15.6496 19.38 13.3096C19.38 10.9696 17.47 9.05957 15.13 9.05957H4.13C3.72 9.05957 3.38 8.71957 3.38 8.30957C3.38 7.89957 3.72 7.55957 4.13 7.55957H15.13C18.3 7.55957 20.88 10.1396 20.88 13.3096C20.88 16.4796 18.3 19.0596 15.13 19.0596Z" fill={Colors.text}/>
            <Path d="M6.43006 11.5599C6.24006 11.5599 6.05006 11.4899 5.90006 11.3399L3.34006 8.77988C3.05006 8.48988 3.05006 8.00988 3.34006 7.71988L5.90006 5.15988C6.19006 4.86988 6.67006 4.86988 6.96006 5.15988C7.25006 5.44988 7.25006 5.92988 6.96006 6.21988L4.93006 8.24988L6.96006 10.2799C7.25006 10.5699 7.25006 11.0499 6.96006 11.3399C6.82006 11.4899 6.62006 11.5599 6.43006 11.5599Z" fill={Colors.text}/>
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dates & Events</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
          <More size={24} color={Colors.text} variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {upcomingDates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingDates.map((date) => (
              <View key={date.id} style={styles.dateCard}>
                <View style={styles.dateIcon}>
                  <Calendar size={24} color={Colors.purple} variant="Bold" />
                </View>
                <View style={styles.dateContent}>
                  <Text style={styles.dateTitle}>{date.title}</Text>
                  <Text style={styles.dateDate}>{date.date}</Text>
                  <Text style={styles.dateLocation}>📍 {date.location}</Text>
                </View>
                <View style={styles.dateActions}>
                  <TouchableOpacity onPress={() => handleEditDate(date)} activeOpacity={0.7}>
                    <Edit2 size={20} color={Colors.text} variant="Outline" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteDate(date)} activeOpacity={0.7}>
                    <Trash size={20} color="#FF4444" variant="Outline" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Dates</Text>
          {pastDates.map((date) => (
            <View key={date.id} style={styles.dateCard}>
              <View style={styles.dateIcon}>
                <Calendar size={24} color={Colors.textSecondary} variant="Outline" />
              </View>
              <View style={styles.dateContent}>
                <Text style={styles.dateTitle}>{date.title}</Text>
                <Text style={styles.dateDate}>{date.date}</Text>
                <Text style={styles.dateLocation}>📍 {date.location}</Text>
              </View>
              <View style={styles.dateActions}>
                <TouchableOpacity onPress={() => handleEditDate(date)} activeOpacity={0.7}>
                  <Edit2 size={20} color={Colors.text} variant="Outline" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDate(date)} activeOpacity={0.7}>
                  <Trash size={20} color="#FF4444" variant="Outline" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* Add/Edit Date Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{selectedDate ? 'Edit Date' : 'Add New Date'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Title</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Dinner at Italian Restaurant"
                  placeholderTextColor={Colors.textSecondary}
                  defaultValue={selectedDate?.title}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Date</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Oct 25, 2024"
                  placeholderTextColor={Colors.textSecondary}
                  defaultValue={selectedDate?.date}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Location</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Downtown"
                  placeholderTextColor={Colors.textSecondary}
                  defaultValue={selectedDate?.location}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Type</Text>
                <View style={styles.typeOptions}>
                  <TouchableOpacity style={[styles.typeOption, styles.typeOptionSelected]} activeOpacity={0.7}>
                    <Text style={[styles.typeOptionText, styles.typeOptionTextSelected]}>Upcoming</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.typeOption} activeOpacity={0.7}>
                    <Text style={styles.typeOptionText}>Past</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveDate}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>{selectedDate ? 'Save Changes' : 'Add Date'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Date Modal */}
      <Modal
        visible={showDateDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateDeleteModal(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteModalIcon}>
              <Trash size={24} color="#FF4444" variant="Bold" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete this date?</Text>
            <Text style={styles.deleteModalMessage}>
              This action cannot be undone. The date will be permanently deleted.
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDateDelete}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.deleteButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.deleteButtonText}>Yes, delete</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDateDeleteModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Category Action Sheet */}
      <CategoryActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onArchive={handleArchive}
        onDelete={handleDelete}
        title="Manage Dates"
        deleteModalVisible={showDeleteModal}
        archiveModalVisible={showArchiveModal}
        onDeleteConfirm={confirmDelete}
        onArchiveConfirm={confirmArchive}
        onDeleteCancel={() => setShowDeleteModal(false)}
        onArchiveCancel={() => setShowArchiveModal(false)}
        deleteMessage="This action cannot be undone. All dates and events will be permanently removed."
        archiveMessage="Dates and events will be moved to archives. You can restore them anytime."
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
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: Spacing.md },
  dateCard: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  dateIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  dateContent: { flex: 1 },
  dateTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: 4 },
  dateDate: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: 4 },
  dateLocation: { fontSize: FontSizes.sm, color: Colors.text },
  dateActions: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '80%' },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  modalScroll: { maxHeight: 400, paddingHorizontal: Spacing.xl },
  modalSection: { marginBottom: Spacing.lg },
  modalLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: Spacing.sm },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.md, color: Colors.text, minHeight: 48 },
  typeOptions: { flexDirection: 'row', gap: Spacing.sm },
  typeOption: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, backgroundColor: '#F5F5F5', alignItems: 'center' },
  typeOptionSelected: { backgroundColor: Colors.purple },
  typeOptionText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text },
  typeOptionTextSelected: { color: Colors.textWhite },
  saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm, marginTop: Spacing.lg },
  saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
  cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
  cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
  deleteModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  deleteModal: { backgroundColor: Colors.background, borderRadius: 24, padding: Spacing.xl, marginHorizontal: Spacing.xl, maxWidth: 340, width: '85%', position: 'relative' },
  deleteModalIcon: { position: 'absolute', top: -20, right: -20, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  deleteModalTitle: { fontSize: 22, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: Spacing.sm, textAlign: 'left', lineHeight: 28 },
  deleteModalMessage: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'left', lineHeight: 20, marginBottom: Spacing.xl },
  deleteButton: { borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm },
  deleteButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  deleteButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
});
