/**
 * Folder Detail Screen
 * Shows notes in 2-column grid layout
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Edit2, Trash, SearchNormal, Note as NoteIcon, More, Add } from 'iconsax-react-native';
import PlusButton from '@/components/ui/PlusButton';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { fetchNotesByFolder, createNote, deleteNote, updateNote, Note } from '@/lib/notes';

export default function FolderDetailScreen() {
  const router = useRouter();
  const { id, folderId } = useLocalSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Database state
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Edit/Delete state
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

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
    setShowAddModal(true);
  };

  // Load notes on mount
  useEffect(() => {
    if (folderId) {
      loadNotes();
    }
  }, [folderId]);
  
  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const { success, data } = await fetchNotesByFolder(folderId as string);
      
      if (success && data) {
        setNotes(data);
      }
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;
    
    try {
      const { success, data } = await createNote(
        id as string,
        noteContent.trim(),
        {
          folderId: folderId as string,
          title: noteTitle.trim() || undefined,
          style: 'default',
        }
      );
      
      if (success && data) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Add to notes list
        setNotes([data, ...notes]);
        
        setShowAddModal(false);
        setNoteTitle('');
        setNoteContent('');
      }
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };
  
  const handleDeletePress = (note: Note) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    try {
      const { success } = await deleteNote(noteToDelete.id);
      
      if (success) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Remove from notes list
        setNotes(notes.filter(n => n.id !== noteToDelete.id));
        setShowDeleteModal(false);
        setNoteToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };
  
  const handleEditPress = (note: Note) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEditingNote(note);
    setNoteTitle(note.title || '');
    setNoteContent(note.content);
    setShowEditModal(true);
  };
  
  const handleUpdateNote = async () => {
    if (!editingNote || !noteContent.trim()) return;
    
    try {
      const { success, data } = await updateNote(editingNote.id, {
        title: noteTitle.trim() || undefined,
        content: noteContent.trim(),
      });
      
      if (success && data) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Update in notes list
        setNotes(notes.map(n => n.id === editingNote.id ? data : n));
        
        setShowEditModal(false);
        setEditingNote(null);
        setNoteTitle('');
        setNoteContent('');
      }
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const handleMenu = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Show folder menu
  };

  // Filter notes by search query
  const filteredNotes = searchQuery
    ? notes.filter(note => 
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  // Mock notes data for reference (now using database)
  const mockNotes = [
    { id: '1', title: 'Allergic to shellfish', content: 'Always check ingredients before ordering', date: 'Oct 20, 2024', category: 'Important' },
    { id: '2', title: 'Emergency contact', content: 'Call 911 in case of emergency', date: 'Oct 19, 2024', category: 'Important' },
    { id: '3', title: 'Medication reminder', content: 'Keep medication in bag at all times', date: 'Oct 18, 2024', category: 'Important' },
    { id: '4', title: 'Doctor appointment', content: 'Annual checkup scheduled for next month', date: 'Oct 17, 2024', category: 'Important' },
    { id: '5', title: 'Dietary restrictions', content: 'No dairy products, lactose intolerant', date: 'Oct 16, 2024', category: 'Important' },
    { id: '6', title: 'Insurance info', content: 'Policy number in wallet', date: 'Oct 15, 2024', category: 'Important' },
  ];

  const folderName = 'Important'; // TODO: Get from route params

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
        <Text style={styles.headerTitle}>{folderName}</Text>
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
            placeholder="Search notes..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Notes Grid (2 columns) */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.purple} />
            <Text style={styles.loadingText}>Loading notes...</Text>
          </View>
        ) : filteredNotes.length > 0 ? (
          <View style={styles.notesGrid}>
            {filteredNotes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                {note.title && (
                  <Text style={styles.noteTitle}>{note.title}</Text>
                )}
                <Text style={styles.noteContent} numberOfLines={3}>{note.content}</Text>
                <Text style={styles.noteDate}>
                  {new Date(note.created_at || '').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity 
                    style={styles.noteActionButton} 
                    activeOpacity={0.7}
                    onPress={() => handleEditPress(note)}
                  >
                    <Edit2 size={18} color={Colors.purple} variant="Outline" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.noteActionButton} 
                    activeOpacity={0.7}
                    onPress={() => handleDeletePress(note)}
                  >
                    <Trash size={18} color="#FF4444" variant="Outline" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <NoteIcon size={48} color={Colors.textSecondary} variant="Outline" />
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptyText}>Tap + to add your first note</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Plus Button */}
      <PlusButton onPress={handleAdd} />

      {/* Add Note Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Note</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Title (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Note title..."
                  placeholderTextColor={Colors.textSecondary}
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Content</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputMultiline]}
                  placeholder="Write your note here..."
                  placeholderTextColor={Colors.textSecondary}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNote}
              activeOpacity={0.8}
              disabled={!noteContent.trim()}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Add Note</Text>
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

      {/* Edit Note Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Note</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Title (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Note title..."
                  placeholderTextColor={Colors.textSecondary}
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Content</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalInputMultiline]}
                  placeholder="Write your note here..."
                  placeholderTextColor={Colors.textSecondary}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateNote}
              activeOpacity={0.8}
              disabled={!noteContent.trim()}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setShowEditModal(false);
                setEditingNote(null);
                setNoteTitle('');
                setNoteContent('');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal - Rizz Style */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteIcon}>
              <Trash size={24} color="#FF4444" variant="Bold" />
            </View>
            <Text style={styles.deleteTitle}>Delete this note?</Text>
            <Text style={styles.deleteMessage}>
              Once deleted, this note will be permanently removed.
            </Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleConfirmDelete}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.deleteGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.deleteButtonText}>Yes, delete</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteCancelButton}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowDeleteModal(false);
                setNoteToDelete(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
    searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
    notesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    noteCard: { width: '48%', backgroundColor: Colors.background, borderRadius: BorderRadius.lg, padding: Spacing.md, minHeight: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, marginBottom: Spacing.sm, paddingBottom: 50 },
    categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.sm, marginBottom: Spacing.sm, backgroundColor: '#FFE5E5' },
    categoryBadgeText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semibold, color: '#FF4444' },
    noteTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.text, marginBottom: Spacing.xs },
    noteContent: { fontSize: FontSizes.sm, color: Colors.text, lineHeight: 18, marginBottom: Spacing.sm, flex: 1 },
    noteDate: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginBottom: Spacing.md },
    noteActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: Spacing.md,
      left: Spacing.md,
      right: Spacing.md,
    },
    noteActionButton: {
      padding: Spacing.xs,
    },
    deleteOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteModal: {
      backgroundColor: Colors.background,
      borderRadius: 24,
      padding: Spacing.xl,
      marginHorizontal: Spacing.xl,
      maxWidth: 340,
      width: '85%',
      position: 'relative',
    },
    deleteIcon: {
      position: 'absolute',
      top: -20,
      right: -20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    deleteTitle: {
      fontSize: 22,
      fontWeight: FontWeights.bold,
      color: Colors.text,
      marginBottom: Spacing.sm,
      textAlign: 'left',
      lineHeight: 28,
    },
    deleteMessage: {
      fontSize: FontSizes.md,
      color: Colors.textSecondary,
      textAlign: 'left',
      lineHeight: 20,
      marginBottom: Spacing.xl,
    },
    deleteButton: {
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
      marginBottom: Spacing.sm,
    },
    deleteGradient: {
      paddingVertical: Spacing.md + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButtonText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.bold,
      color: Colors.textWhite,
    },
    deleteCancelButton: {
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    deleteCancelText: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: Colors.purple,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingBottom: Spacing.xxl, maxHeight: '80%' },
    modalHandle: { width: 40, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md, marginBottom: Spacing.lg },
    modalTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.text, paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
    modalScroll: { maxHeight: 400, paddingHorizontal: Spacing.xl },
    modalSection: { marginBottom: Spacing.lg },
    modalLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, color: Colors.text, marginBottom: Spacing.sm },
    modalInput: { backgroundColor: '#F5F5F5', borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.md, color: Colors.text, minHeight: 48 },
    modalInputMultiline: { minHeight: 150 },
    saveButton: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.full, overflow: 'hidden', marginBottom: Spacing.sm, marginTop: Spacing.lg },
    saveButtonGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
    saveButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textWhite },
    cancelButton: { paddingVertical: Spacing.md, alignItems: 'center' },
    cancelButtonText: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.purple },
    loadingContainer: {
      paddingVertical: Spacing.xxl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: FontSizes.md,
      color: Colors.textSecondary,
      marginTop: Spacing.md,
    },
    emptyState: {
      paddingVertical: Spacing.xxl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      color: Colors.textSecondary,
      marginTop: Spacing.sm,
    },
    emptyText: {
      fontSize: FontSizes.sm,
      color: Colors.textSecondary,
      marginTop: Spacing.xs,
    },
  });
