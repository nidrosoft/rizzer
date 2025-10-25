/**
 * QuickNotesCard Component
 * Displays quick notes with add functionality
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeLinearGradient as LinearGradient } from '@/components/ui/SafeLinearGradient';
import { Add, Note, Heart, Star1, Danger, InfoCircle, TickCircle } from 'iconsax-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { QuickNotesCardProps } from '@/types/dateProfile';
import { fetchRecentNotes, createNote, fetchNoteFolders, Note as NoteType, NoteFolder } from '@/lib/notes';

type NoteStyle = 'default' | 'important' | 'love' | 'idea' | 'reminder';

const noteStyles = {
  default: { icon: Note, color: Colors.purple, bg: `${Colors.purple}10`, border: `${Colors.purple}30` },
  important: { icon: Danger, color: '#FF4444', bg: '#FFE5E5', border: '#FFCCCC' },
  love: { icon: Heart, color: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.1)', border: 'rgba(255, 107, 157, 0.2)' },
  idea: { icon: Star1, color: '#FFA500', bg: '#FFF4E5', border: '#FFE5CC' },
  reminder: { icon: TickCircle, color: '#4CAF50', bg: '#E8F5E9', border: '#C8E6C9' },
};

interface QuickNotesCardPropsExtended extends Omit<QuickNotesCardProps, 'notes'> {
  profileId: string;
}

export default function QuickNotesCard({ profileId, onAddNote, onEditNote }: QuickNotesCardPropsExtended) {
  const handleCardPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAddNote();
  };
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteStyle, setNoteStyle] = useState<NoteStyle>('default');
  
  // Database state
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load folders and recent notes on mount
  useEffect(() => {
    if (profileId) {
      loadFolders();
      loadRecentNotes();
    }
  }, [profileId]);
  
  const loadFolders = async () => {
    try {
      const { success, data } = await fetchNoteFolders(profileId);
      
      if (success && data) {
        setFolders(data);
      }
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  };
  
  const loadRecentNotes = async () => {
    try {
      setIsLoading(true);
      const { success, data } = await fetchRecentNotes(profileId, 5);
      
      if (success && data) {
        setNotes(data);
      }
    } catch (err) {
      console.error('Error loading recent notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNoteClick = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Call parent's onAddNote to navigate to Notes category
    onAddNote();
  };

  const handleEditNote = (note: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedNote(note);
    setNoteContent(note.content);
    setNoteStyle(note.style || 'default');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!noteContent.trim()) return;
    
    try {
      const { success, data } = await createNote(
        profileId,
        noteContent.trim(),
        { style: noteStyle }
      );
      
      if (success && data) {
        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Add to notes list
        setNotes([data, ...notes.slice(0, 4)]);
        
        setShowModal(false);
        setNoteContent('');
        setNoteStyle('default');
      }
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleSelectStyle = (style: NoteStyle) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNoteStyle(style);
  };

  return (
    <>
    <TouchableOpacity 
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>Quick Notes</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation();
            handleAddNoteClick();
          }}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Add size={18} color={Colors.textWhite} variant="Outline" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.purple} />
        </View>
      ) : folders.length > 0 ? (
        <View style={styles.foldersList}>
          {folders.slice(0, 3).map((folder, index) => (
            <View key={folder.id}>
              <View style={styles.folderItem}>
                <Text style={styles.folderName} numberOfLines={1}>
                  📁 {folder.name}
                </Text>
                <Text style={styles.folderCount}>
                  {folder.note_count || 0} {folder.note_count === 1 ? 'note' : 'notes'}
                </Text>
              </View>
              {index < Math.min(folders.length, 3) - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Note size={48} color={Colors.textSecondary} variant="Outline" />
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyText}>Tap + to add your first note</Text>
        </View>
      )}
    </TouchableOpacity>

    {/* Add/Edit Note Modal */}
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>
            {selectedNote ? 'Edit Note' : 'Add Quick Note'}
          </Text>

          <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              {/* Note Style Selector */}
              <View style={styles.styleSection}>
                <Text style={styles.styleLabel}>Note Style</Text>
                <View style={styles.styleOptions}>
                  {(Object.keys(noteStyles) as NoteStyle[]).map((key) => {
                    const style = noteStyles[key];
                    const IconComponent = style.icon;
                    const isSelected = noteStyle === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.styleOption,
                          { backgroundColor: style.bg, borderColor: style.border },
                          isSelected && styles.styleOptionSelected
                        ]}
                        onPress={() => handleSelectStyle(key)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.styleIcon, { backgroundColor: style.color }]}>
                          <IconComponent size={18} color={Colors.textWhite} variant="Bold" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Note Content */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Note Content</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write your note here..."
                  placeholderTextColor={Colors.textSecondary}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={!noteContent.trim()}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveButtonText}>
                    {selectedNote ? 'Save Changes' : 'Add Note'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  emoji: {
    fontSize: FontSizes.xl,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesList: {
    gap: Spacing.sm,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  noteIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  styleSection: {
    marginBottom: Spacing.xl,
  },
  styleLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  styleOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  styleOption: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleOptionSelected: {
    borderWidth: 3,
    borderColor: Colors.purple,
  },
  styleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  textArea: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 120,
  },
  modalActions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  saveButtonGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.purple,
  },
  loadingContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foldersList: {
    marginTop: Spacing.xs,
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  folderName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    flex: 1,
  },
  folderCount: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
});
